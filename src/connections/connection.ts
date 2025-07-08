import net from "net";
import { EventEmitter } from "events";
import { Command, Response } from "../protobuf/compiled/comm_pb";

export class Connection extends EventEmitter {
  private socket: net.Socket;
  private buffer: Buffer = Buffer.alloc(0);
  private pendingRead: {
    resolve: (value: Response) => void;
    reject: (reason?: any) => void;
  } | null = null;

  constructor(
    private host: string,
    private port: number,
    public clientId: string = "",
  ) {
    super();
    this.socket = new net.Socket();
    this.setupSocket();
  }

  private setupSocket(): void {
    this.socket.on("data", (data) => {
      this.buffer = Buffer.concat([this.buffer, data]);
      this.processBuffer();
    });

    this.socket.on("error", (err) => this.emit("error", err));
    this.socket.on("close", () => this.emit("close"));
  }

  private processBuffer(): void {
    while (this.buffer.length >= 4 && this.pendingRead) {
      const length = this.buffer.readUInt32BE(0);
      if (this.buffer.length >= 4 + length) {
        const messageData = this.buffer.slice(4, 4 + length);
        this.buffer = this.buffer.slice(4 + length);

        try {
          const response = Response.deserializeBinary(messageData);
          this.pendingRead.resolve(response);
          this.pendingRead = null;
        } catch (err) {
          this.pendingRead?.reject(err);
          this.pendingRead = null;
        }
      } else {
        break;
      }
    }
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const onConnect = () => {
        this.socket.off("error", onError);
        resolve();
      };

      const onError = (err: Error) => {
        this.socket.off("connect", onConnect);
        reject(err);
      };

      this.socket.once("connect", onConnect);
      this.socket.once("error", onError);
      this.socket.connect(this.port, this.host);
    });
  }

  async write(msg: Command): Promise<void> {
    return new Promise((resolve, reject) => {
      const data = msg.serializeBinary();
      const lengthBuffer = Buffer.alloc(4);
      lengthBuffer.writeUInt32BE(data.length, 0);

      this.socket.write(
        Buffer.concat([lengthBuffer, Buffer.from(data)]),
        (err) => {
          if (err) reject(err);
          else resolve();
        },
      );
    });
  }

  async read(): Promise<Response> {
    return new Promise((resolve, reject) => {
      if (this.pendingRead) {
        reject(new Error("Already waiting for a response"));
        return;
      }

      this.pendingRead = { resolve, reject };
      this.processBuffer(); // Check if we already have data
    });
  }

  async close(): Promise<void> {
    return new Promise((resolve) => {
      if (this.socket.destroyed) {
        resolve();
      } else {
        this.socket.once("close", resolve);
        this.socket.end();
      }
    });
  }
}
