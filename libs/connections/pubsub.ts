import { EventEmitter } from "events";
import { Connection } from "./connection";
import { Command, Response } from "../compiled/comm_pb";

type OnMessage = (payload: any) => void;

export class PubSubClient extends EventEmitter {
  private host: string;
  private port: number;
  private username?: string;
  private password?: string;
  private connection?: Connection;
  private subscriptions: Map<string, Set<OnMessage>> = new Map();

  constructor(host: string, port: number, username?: string, password?: string) {
    super();
    this.host = host;
    this.port = port;
    this.username = username;
    this.password = password;
  }

  /**
   * Connect to server (for both pub and sub client)
   */
  async connect(): Promise<void> {
    this.connection = new Connection(this.host, this.port);
    await this.connection.connect();

    const cmd = new Command();
    cmd.setCommand("auth");
    cmd.setArgsList([this.username || "", this.password || ""]);
    await this.connection.write(cmd);

    const decoder = new TextDecoder();
    const response = await this.connection.read();
    const result = response.getResult();
      const str =
        typeof result === "string" ? result : decoder.decode(result);

    if (response.getStatus() !== "Ok") {
      await this.connection.close();
      throw new Error(`Auth failed: ${str}`);
    }
    
    this.connection.clientId = response.getClientId();
    this.emit("ready", response.getClientId());

    this.connection.on("error", (err) => this.emit("error", err));
    this.connection.on("close", () =>
      this.emit("close", this.connection?.clientId)
    );

    // Start dispatch loop (for subscriber use)
    (async () => {
      while (true) {
        try {
          const data = await this.connection!.read();
          let channel = data.getTopic();

          const decoder = new TextDecoder();
            const result = data.getResult();
            let payload: any =
            typeof result === "string" ? result : decoder.decode(result);
                
            try {
                payload = JSON.parse(payload);
            } catch {
                // not JSON → fallback
            }

            const handlers = this.subscriptions.get(channel);
            if (handlers) {
                handlers.forEach((fn) => fn(payload));
            }
        } catch (err) {
          this.emit("error", err);
          break;
        }
      }
    })();
  }

  /**
   * Publish a message (publisher client only)
   */
  async publish(channel: string, message: any): Promise<void> {
    if (!this.connection) throw new Error("Not connected");

    const cmd = new Command();
    cmd.setCommand("publish");
    cmd.setArgsList([channel, JSON.stringify(message)]);
    await this.connection.write(cmd);
  }

  /**
   * Subscribe to a channel
   */
  async subscribe(channel: string, handler: OnMessage): Promise<void> {
    if (!this.connection) throw new Error("Not connected");

    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set());

      const subCmd = new Command();
      subCmd.setCommand("subscribe");
      subCmd.setArgsList([channel]);
      await this.connection.write(subCmd);
    }
    this.subscriptions.get(channel)!.add(handler);
  }

  /**
   * Unsubscribe from a channel
   */
  async unsubscribe(channel: string, handler?: OnMessage): Promise<void> {
    if (!this.connection || !this.subscriptions.has(channel)) return;

    if (handler) {
      this.subscriptions.get(channel)!.delete(handler);
    }

    if (!handler || this.subscriptions.get(channel)!.size === 0) {
      this.subscriptions.delete(channel);

      const unsubCmd = new Command();
      unsubCmd.setCommand("unsubscribe");
      unsubCmd.setArgsList([channel]);
      await this.connection.write(unsubCmd);
    }
  }

  /**
   * Close connection
   */
  async close(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      this.emit("close", this.connection.clientId);
    }
  }
}

export default PubSubClient;