import { EventEmitter } from "events";
import { Options, ClientState } from "./types";
export declare class Fleare extends EventEmitter {
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
