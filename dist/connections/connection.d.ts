import { EventEmitter } from "events";
import { Command, Response } from "../protobuf/compiled/comm_pb";
export declare class Connection extends EventEmitter {
    private host;
    private port;
    clientId: string;
    private socket;
    private buffer;
    private pendingRead;
    constructor(host: string, port: number, clientId?: string);
    private setupSocket;
    private processBuffer;
    connect(): Promise<void>;
    write(msg: Command): Promise<void>;
    read(): Promise<Response>;
    close(): Promise<void>;
}
