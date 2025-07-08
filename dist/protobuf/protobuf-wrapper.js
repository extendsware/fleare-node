"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtobufWrapper = void 0;
const comm_pb_1 = require("./compiled/comm_pb");
class ProtobufWrapper {
    static createCommand(command, args = []) {
        const cmd = new comm_pb_1.Command();
        cmd.setCommand(command);
        cmd.setArgsList(args);
        return cmd;
    }
    static parseResponse(data) {
        return comm_pb_1.Response.deserializeBinary(data);
    }
}
exports.ProtobufWrapper = ProtobufWrapper;
//# sourceMappingURL=protobuf-wrapper.js.map