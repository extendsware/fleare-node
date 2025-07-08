import { Command, Response } from "./compiled/comm_pb";
export declare class ProtobufWrapper {
    static createCommand(command: string, args?: string[]): Command;
    static parseResponse(data: Uint8Array): Response;
}
