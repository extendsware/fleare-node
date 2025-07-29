import { EventEmitter } from "events";
import { Connection } from "./connection";
import { Options } from "../types";
import { Command, Response } from "../compiled/comm_pb";

interface QueuedRequest {
  command: string;
  args: string[];
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

interface ConnectionState {
  connection: Connection;
  busy: boolean;
  requestCount: number;
  lastUsed: number;
}

export class ConnectionPool extends EventEmitter {
  private connectionStates: ConnectionState[] = [];
  private requestQueue: QueuedRequest[] = [];
  private host: string;
  private port: number;
  private username: string;
  private password: string;
  private poolSize: number;
  private connectTimeout: number;
  private retryInterval: number;
  private maxRetries: number;
  private maxQueueSize: number;
  private requestTimeout: number;
  private processing: boolean = false;
  private requestIdCounter: number = 0;

  constructor(
    private _host: string,
    private _port: number,
    private options: Options,
  ) {
    super();
    this.host = _host;
    this.port = _port;
    this.username = options.username ?? "";
    this.password = options.password ?? "";
    this.poolSize = options.poolSize ?? 10;
    this.connectTimeout = options.connectTimeout ?? 30;
    this.retryInterval = options.retryInterval ?? 10;
    this.maxRetries = options.maxRetries ?? 3;
    this.maxQueueSize = options.maxQueueSize ?? 100000;
    this.requestTimeout = options.requestTimeout ?? 30000;
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
        this.handleConnectionError(connection, err);
      });

      connection.on("close", () => {
        this.removeConnection(connection);
      });

      connection.clientId = response.getClientId();

      const connectionState: ConnectionState = {
        connection,
        busy: false,
        requestCount: 0,
        lastUsed: Date.now(),
      };

      this.connectionStates.push(connectionState);
    }
  }

  private handleConnectionError(connection: Connection, err: Error): void {
    // Mark connection as not busy
    const state = this.connectionStates.find(
      (s) => s.connection === connection,
    );
    if (state) {
      state.busy = false;
    }
    this.emit("error", err);
    this.processQueue();
  }

  removeConnection(connection: Connection): void {
    const index = this.connectionStates.findIndex(
      (s) => s.connection === connection,
    );
    if (index !== -1) {
      this.connectionStates.splice(index, 1);
    }
    if (this.connectionStates.length === 0) {
      this.emit("close");
    }
    this.processQueue();
  }

  private getAvailableConnection(): ConnectionState | null {
    // Find the next available connection using round robin
    const availableConnections = this.connectionStates.filter(
      (state) => !state.busy,
    );

    if (availableConnections.length === 0) {
      return null;
    }

    // Use modulo to cycle through available connections
    const index = this.requestIdCounter % availableConnections.length;
    this.requestIdCounter++;

    return availableConnections[index];
  }

  async sendCommand(command: string, args: string[] = []): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      // Check queue size limit to prevent memory issues
      if (this.requestQueue.length >= this.maxQueueSize) {
        reject(
          new Error(
            `Request queue is full (${this.maxQueueSize}). Too many concurrent requests.`,
          ),
        );
        return;
      }

      const queuedRequest: QueuedRequest = {
        command,
        args,
        resolve,
        reject,
      };

      this.requestQueue.push(queuedRequest);
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.requestQueue.length === 0) {
      return;
    }

    this.processing = true;

    try {
      while (this.requestQueue.length > 0) {
        const connectionState = this.getAvailableConnection();
        if (!connectionState) {
          break; // No available connections, wait for one to free up
        }

        const queuedRequest = this.requestQueue.shift();
        if (!queuedRequest) {
          break;
        }

        // Mark connection as busy and update last used time
        connectionState.busy = true;
        connectionState.requestCount++;
        connectionState.lastUsed = Date.now();

        // Process the request asynchronously without blocking the queue
        this.executeRequest(connectionState, queuedRequest);
      }
    } finally {
      this.processing = false;
    }
  }

  private async executeRequest(
    connectionState: ConnectionState,
    queuedRequest: QueuedRequest,
  ): Promise<void> {
    try {
      const { connection } = connectionState;
      const { command, args, resolve, reject } = queuedRequest;

      const cmd = new Command();
      cmd.setCommand(command);

      const stringArray: string[] = args.map((item) =>
        typeof item === "object" && item !== null
          ? JSON.stringify(item)
          : String(item),
      );

      cmd.setArgsList(stringArray);

      await connection.write(cmd);
      const response = await connection.read();

      const decoder = new TextDecoder();
      const result = response.getResult();
      const str = typeof result === "string" ? result : decoder.decode(result);

      if (response.getStatus() === "Error") {
        reject(new Error(str));
      } else {
        resolve(this.parseResult(str));
      }
    } catch (error) {
      queuedRequest.reject(error);
    } finally {
      // Mark connection as available and trigger next batch
      connectionState.busy = false;
      connectionState.lastUsed = Date.now();

      // Use setImmediate to avoid blocking and allow other operations
      setImmediate(() => this.processQueue());
    }
  }

  async closeAll(): Promise<void> {
    // Clear processing flag to prevent new requests from being processed
    this.processing = true;

    // Reject all pending requests with clear error messages
    while (this.requestQueue.length > 0) {
      const queuedRequest = this.requestQueue.shift();
      if (queuedRequest) {
        queuedRequest.reject(new Error("Connection pool is closing"));
      }
    }

    // Close all connections
    await Promise.all(
      this.connectionStates.map((state) => state.connection.close()),
    );

    // Clear connection states
    this.connectionStates = [];
  }

  // Get pool statistics for monitoring and debugging
  getPoolStats(): {
    totalConnections: number;
    busyConnections: number;
    availableConnections: number;
    queuedRequests: number;
    totalRequests: number;
    averageRequestsPerConnection: number;
  } {
    const busyCount = this.connectionStates.filter(
      (state) => state.busy,
    ).length;
    const totalRequests = this.connectionStates.reduce(
      (sum, state) => sum + state.requestCount,
      0,
    );

    return {
      totalConnections: this.connectionStates.length,
      busyConnections: busyCount,
      availableConnections: this.connectionStates.length - busyCount,
      queuedRequests: this.requestQueue.length,
      totalRequests,
      averageRequestsPerConnection:
        this.connectionStates.length > 0
          ? totalRequests / this.connectionStates.length
          : 0,
    };
  }

  // Get detailed connection information for debugging
  getConnectionDetails(): Array<{
    clientId: string;
    busy: boolean;
    requestCount: number;
    lastUsed: Date;
  }> {
    return this.connectionStates.map((state) => ({
      clientId: state.connection.clientId,
      busy: state.busy,
      requestCount: state.requestCount,
      lastUsed: new Date(state.lastUsed),
    }));
  }

  parseResult(result: string): any {
    try {
      return JSON.parse(result);
    } catch {
      return result;
    }
  }
}
