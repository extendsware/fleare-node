"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const net_1 = __importDefault(require("net"));
const events_1 = require("events");
const comm_pb_1 = require("../protobuf/compiled/comm_pb");
class Connection extends events_1.EventEmitter {
    constructor(host, port, clientId = "") {
        super();
        this.host = host;
        this.port = port;
        this.clientId = clientId;
        this.buffer = Buffer.alloc(0);
        this.pendingRead = null;
        this.socket = new net_1.default.Socket();
        this.setupSocket();
    }
    setupSocket() {
        this.socket.on("data", (data) => {
            this.buffer = Buffer.concat([this.buffer, data]);
            this.processBuffer();
        });
        this.socket.on("error", (err) => this.emit("error", err));
        this.socket.on("close", () => this.emit("close"));
    }
    processBuffer() {
        var _a;
        while (this.buffer.length >= 4 && this.pendingRead) {
            const length = this.buffer.readUInt32BE(0);
            if (this.buffer.length >= 4 + length) {
                const messageData = this.buffer.slice(4, 4 + length);
                this.buffer = this.buffer.slice(4 + length);
                try {
                    const response = comm_pb_1.Response.deserializeBinary(messageData);
                    this.pendingRead.resolve(response);
                    this.pendingRead = null;
                }
                catch (err) {
                    (_a = this.pendingRead) === null || _a === void 0 ? void 0 : _a.reject(err);
                    this.pendingRead = null;
                }
            }
            else {
                break;
            }
        }
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const onConnect = () => {
                    this.socket.off("error", onError);
                    resolve();
                };
                const onError = (err) => {
                    this.socket.off("connect", onConnect);
                    reject(err);
                };
                this.socket.once("connect", onConnect);
                this.socket.once("error", onError);
                this.socket.connect(this.port, this.host);
            });
        });
    }
    write(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const data = msg.serializeBinary();
                const lengthBuffer = Buffer.alloc(4);
                lengthBuffer.writeUInt32BE(data.length, 0);
                this.socket.write(Buffer.concat([lengthBuffer, Buffer.from(data)]), (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            });
        });
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                // if (this.pendingRead) {
                //   reject(new Error("Already waiting for a response"));
                //   return;
                // }
                this.pendingRead = { resolve, reject };
                this.processBuffer(); // Check if we already have data
            });
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                if (this.socket.destroyed) {
                    resolve();
                }
                else {
                    this.socket.once("close", resolve);
                    this.socket.end();
                }
            });
        });
    }
}
exports.Connection = Connection;
//# sourceMappingURL=connection.js.map