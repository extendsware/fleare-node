import { Command, Response } from "./compiled/comm_pb";

export class ProtobufWrapper {
  static createCommand(command: string, args: string[] = []): Command {
    const cmd = new Command();
    cmd.setCommand(command);
    cmd.setArgsList(args);
    return cmd;
  }

  static parseResponse(data: Uint8Array): Response {
    return Response.deserializeBinary(data);
  }
}
