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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionPool = void 0;
const events_1 = require("events");
const connection_1 = require("./connection");
const comm_pb_1 = require("../protobuf/compiled/comm_pb");
class ConnectionPool extends events_1.EventEmitter {
    constructor(_host, _port, options) {
        var _a, _b, _c, _d;
        super();
        this._host = _host;
        this._port = _port;
        this.options = options;
        this.connections = [];
        this.currentIndex = 0;
        this.host = _host;
        this.port = _port;
        this.username = options.username;
        this.password = options.password;
        this.poolSize = (_a = options.poolSize) !== null && _a !== void 0 ? _a : 10;
        this.connectTimeout = (_b = options.connectTimeout) !== null && _b !== void 0 ? _b : 30;
        this.retryInterval = (_c = options.retryInterval) !== null && _c !== void 0 ? _c : 10;
        this.maxRetries = (_d = options.maxRetries) !== null && _d !== void 0 ? _d : 3;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < this.poolSize; i++) {
                const connection = new connection_1.Connection(this.host, this.port);
                yield connection.connect();
                // Authenticate each connection
                const cmd = new comm_pb_1.Command();
                cmd.setCommand("auth");
                cmd.setArgsList([this.username, this.password]);
                yield connection.write(cmd);
                const response = yield connection.read();
                if (response.getStatus() !== "Ok") {
                    yield connection.close();
                    const decoder = new TextDecoder(); // defaults to 'utf-8'
                    const result = response.getResult();
                    const str = typeof result === "string" ? result : decoder.decode(result);
                    throw new Error(str);
                }
                connection.on("error", (err) => {
                    this.emit("error", err);
                });
                connection.on("close", () => {
                    this.removeConnection(connection);
                });
                connection.clientId = response.getClientId();
                this.connections.push(connection);
            }
        });
    }
    removeConnection(connection) {
        const index = this.connections.indexOf(connection);
        if (index !== -1) {
            this.connections.splice(index, 1);
            // Adjust currentIndex if needed
            if (this.currentIndex >= this.connections.length) {
                this.currentIndex = 0;
            }
        }
        if (this.connections.length == 0) {
            this.emit("close");
        }
    }
    getNextConnection() {
        const connection = this.connections[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.poolSize;
        return connection;
    }
    sendCommand(command_1) {
        return __awaiter(this, arguments, void 0, function* (command, args = []) {
            const connection = this.getNextConnection();
            const cmd = new comm_pb_1.Command();
            cmd.setCommand(command);
            cmd.setArgsList(args);
            yield connection.write(cmd);
            const response = yield connection.read();
            const decoder = new TextDecoder(); // defaults to 'utf-8'
            const result = response.getResult();
            const str = typeof result === "string" ? result : decoder.decode(result);
            if (response.getStatus() == "Error") {
                throw new Error(str);
            }
            return Promise.resolve(this.parseResult(str));
        });
    }
    closeAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(this.connections.map((conn) => conn.close()));
        });
    }
    parseResult(result) {
        try {
            return JSON.parse(result);
        }
        catch (_a) {
            return result;
        }
    }
}
exports.ConnectionPool = ConnectionPool;
//# sourceMappingURL=connectionPool.js.map