import { EventEmitter } from "events";
import net from "net";
import { Connection } from "./connection";
import { Options } from "../types";
import { Command, Response } from "../protobuf/compiled/comm_pb";

export class ConnectionPool extends EventEmitter {
  private connections: Connection[] = [];
  private currentIndex = 0;
  private host: string;
  private port: number;
  private username: string;
  private password: string;
  private poolSize: number;
  private connectTimeout: number;
  private retryInterval: number;
  private maxRetries: number;

  constructor(
    private _host: string,
    private _port: number,
    private options: Options,
  ) {
    super();
    this.host = _host;
    this.port = _port;
    this.username = options.username ?? '';
    this.password = options.password ?? '';
    this.poolSize = options.poolSize ?? 10;
    this.connectTimeout = options.connectTimeout ?? 30;
    this.retryInterval = options.retryInterval ?? 10;
    this.maxRetries = options.maxRetries ?? 3;
  }

  async initialize(): Promise<void> {
    for (let i = 0; i < this.poolSize; i++) {
      const connection = new Connection(this.host, this.port);
      await connection.connect();

      // Authenticate each connection
      const cmd = new Command();
      cmd.setCommand("auth");
      cmd.setArgsList([this.username, this.password]);

      await connection.write(cmd);
      const response = await connection.read();

      if (response.getStatus() !== "Ok") {
        await connection.close();

        const decoder = new TextDecoder(); // defaults to 'utf-8'
        const result = response.getResult();
        const str =
          typeof result === "string" ? result : decoder.decode(result);
        throw new Error(str);
      }

      connection.on("error", (err) => {
        this.emit("error", err);
      });

      connection.on("close", () => {
        this.removeConnection(connection);
      });

      connection.clientId = response.getClientId();
      this.connections.push(connection);
    }
  }

  removeConnection(connection: Connection): void {
    const index = this.connections.indexOf(connection);
    if (index !== -1) {
      this.connections.splice(index, 1);
      // Adjust currentIndex if needed
      if (this.currentIndex >= this.connections.length) {
        this.currentIndex = 0;
      }
    }
    if (this.connections.length == 0) {
      this.emit("close");
    }
  }

  private getNextConnection(): Connection {
    const connection = this.connections[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.poolSize;
    return connection;
  }

  async sendCommand(command: string, args: string[] = []): Promise<any> {
    const connection = this.getNextConnection();
    const cmd = new Command();
    cmd.setCommand(command);
    cmd.setArgsList(args);

    await connection.write(cmd);
    const response = await connection.read();

    const decoder = new TextDecoder(); // defaults to 'utf-8'
    const result = response.getResult();
    const str = typeof result === "string" ? result : decoder.decode(result);
    if (response.getStatus() == "Error") {
      throw new Error(str);
    }
    return Promise.resolve(this.parseResult(str));
  }

  async closeAll(): Promise<void> {
    await Promise.all(this.connections.map((conn) => conn.close()));
  }

  parseResult(result: string): any {
    try {
      return JSON.parse(result);
    } catch {
      return result;
    }
  }
}
