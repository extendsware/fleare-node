import net from "net";
import { EventEmitter } from "events";
import { Command, Response } from "../compiled/comm_pb";

export class Connection extends EventEmitter {
  private socket: net.Socket;
  private buffer: Buffer = Buffer.alloc(0);
  private readQueue: Array<{
    resolve: (value: Response) => void;
    reject: (reason?: any) => void;
  }> = [];
  private maxReadQueueSize: number = 100;
  private isConnected: boolean = false;

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

    this.socket.on("error", (err) => {
      this.clearReadQueue(err);
      this.isConnected = false;
      this.emit("error", err);
    });

    this.socket.on("close", () => {
      this.clearReadQueue(new Error("Connection closed"));
      this.isConnected = false;
      this.emit("close");
    });
  }

  private processBuffer(): void {
    while (this.buffer.length >= 4 && this.readQueue.length > 0) {
      const length = this.buffer.readUInt32BE(0);
      if (this.buffer.length >= 4 + length) {
        const messageData = this.buffer.slice(4, 4 + length);
        this.buffer = this.buffer.slice(4 + length);

        const pendingRead = this.readQueue.shift();
        if (pendingRead) {
          try {
            const response = Response.deserializeBinary(messageData);
            pendingRead.resolve(response);
          } catch (err) {
            pendingRead.reject(err);
          }
        }
      } else {
        break;
      }
    }
  }

  private clearReadQueue(error: Error): void {
    while (this.readQueue.length > 0) {
      const pendingRead = this.readQueue.shift();
      if (pendingRead) {
        pendingRead.reject(error);
      }
    }
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const onConnect = () => {
        this.socket.off("error", onError);
        this.isConnected = true;
        resolve();
      };

      const onError = (err: Error) => {
        this.socket.off("connect", onConnect);
        this.isConnected = false;
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
      // Check if we've exceeded the maximum queue size
      if (this.readQueue.length >= this.maxReadQueueSize) {
        reject(new Error(`Read queue is full (max: ${this.maxReadQueueSize})`));
        return;
      }

      this.readQueue.push({ resolve, reject });
      this.processBuffer(); // Check if we already have data
    });
  }

  async close(): Promise<void> {
    this.isConnected = false;
    return new Promise((resolve) => {
      if (this.socket.destroyed) {
        resolve();
      } else {
        this.socket.once("close", resolve);
        this.socket.end();
      }
    });
  }

  // Health check methods
  isHealthy(): boolean {
    return (
      this.isConnected &&
      !this.socket.destroyed &&
      this.readQueue.length < this.maxReadQueueSize
    );
  }

  getReadQueueSize(): number {
    return this.readQueue.length;
  }

  getConnectionStats(): {
    isConnected: boolean;
    readQueueSize: number;
    socketDestroyed: boolean;
  } {
    return {
      isConnected: this.isConnected,
      readQueueSize: this.readQueue.length,
      socketDestroyed: this.socket.destroyed,
    };
  }
}
