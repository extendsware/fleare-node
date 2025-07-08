import { EventEmitter } from "events";
import { Connection } from "./connection";
import { Options } from "../types";
export declare class ConnectionPool extends EventEmitter {
    private _host;
    private _port;
    private options;
    private connections;
    private currentIndex;
    private host;
    private port;
    private username;
    private password;
    private poolSize;
    private connectTimeout;
    private retryInterval;
    private maxRetries;
    constructor(_host: string, _port: number, options: Options);
    initialize(): Promise<void>;
    removeConnection(connection: Connection): void;
    private getNextConnection;
    sendCommand(command: string, args?: string[]): Promise<any>;
    closeAll(): Promise<void>;
    parseResult(result: string): any;
}
