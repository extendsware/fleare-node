import { EventEmitter } from "events";
import { commands, CommandMap } from "./commands";
import { ConnectionPool } from "./connections";
import { Options, ClientState } from "./types";
import PubSubClient from "./connections/pubsub";
import { Command, Response } from "./compiled/comm_pb";

type CommandFunctions = {
  [K in keyof CommandMap]: CommandMap[K] extends (
    this: Client,
    ...args: infer A
  ) => infer R
    ? (...args: A) => R
    : never;
};

export class Client extends EventEmitter {
  private connectionPool: ConnectionPool;
  private state: ClientState = ClientState.DISCONNECTED;

  constructor(
    private host: string,
    private port: number,
    private options: Options,
  ) {
    super();

    this.host = host;
    this.port = port;
    this.options = options;

    this.connectionPool = new ConnectionPool(host, port, options);

    this.connectionPool.on("error", (err) => this.emit("error", err));
    this.connectionPool.on("close", () => this.emit("close"));
    this.connectionPool.on("pubsubError", () => this.emit("pubsubError"));
    this.connectionPool.on("pubsubClose", () => this.emit("pubsubClose"));

    // Attach commands with `this` binding
    for (const [name, handler] of Object.entries(commands)) {
      (this as any)[name] = handler.bind(this);
    }
  }

  private setState(newState: ClientState): void {
    const oldState = this.state;
    this.state = newState;
    this.emit(ClientState.CHANGE_STATE, newState);

    if (oldState !== newState) {
      if (newState === ClientState.CONNECTED) {
        this.emit(ClientState.CONNECTED);
      } else if (newState === ClientState.DISCONNECTED) {
        this.emit(ClientState.DISCONNECTED);
      }
    }
  }

  async connect(): Promise<void> {
    if (this.state !== ClientState.DISCONNECTED) {
      return;
    }

    this.setState(ClientState.CONNECTING);

    try {
      await this.connectionPool.initialize();
      this.setState(ClientState.CONNECTED);
    } catch (err) {
      this.setState(ClientState.ERROR);
      this.emit(ClientState.ERROR, err);
      throw err;
    }
  }

  async executeCommand(command: string, args: string[] = []): Promise<any> {
    if (this.state !== ClientState.CONNECTED) {
      throw new Error("Client is not connected");
    }

    try {
      // convert all args as a string
      return await this.connectionPool.sendCommand(command, args);
    } catch (err) {
      this.emit(ClientState.ERROR, err);
      throw err;
    }
  }

  async close(): Promise<void> {
    if (this.state !== ClientState.CONNECTED) {
      return;
    }

    this.setState(ClientState.DISCONNECTING);

    try {
      await this.connectionPool.closeAll();
      this.setState(ClientState.DISCONNECTED);
    } catch (err) {
      this.setState(ClientState.ERROR);
      this.emit(ClientState.ERROR, err);
      throw err;
    }
  }

  getState(): ClientState {
    return this.state;
  }

  // Helpers to create pub or sub client
  createPubClient(): PubSubClient {
    return new PubSubClient(this.host, this.port, this.options.username, this.options.password);
  }

  createSubClient(): PubSubClient {
    return new PubSubClient(this.host, this.port, this.options.username, this.options.password);
  }
}

export interface Client extends CommandFunctions {}

/**
 * Creates a new Fleare client instance
 * @param host - The server host
 * @param port - The server port
 * @param options - Client configuration options
 * @returns A new Client instance
 */
export default function createClient(
  host: string,
  port: number,
  options: Options,
): Client {
  return new Client(host, port, options);
}
