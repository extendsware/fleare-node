import { EventEmitter } from "events";
import { Options, ClientState } from "./types";
export declare class Client extends EventEmitter {
    private host;
    private port;
    private options;
    private connectionPool;
    private state;
    constructor(host: string, port: number, options: Options);
    private setState;
    connect(): Promise<void>;
    send(command: string, args?: string[], options?: Options): Promise<any>;
    close(): Promise<void>;
    getState(): ClientState;
}
/**
 * Creates a new Fleare client instance
 * @param host - The server host
 * @param port - The server port
 * @param options - Client configuration options
 * @returns A new Client instance
 */
export default function createClient(host: string, port: number, options: Options): Client;
