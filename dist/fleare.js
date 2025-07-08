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
exports.Fleare = void 0;
const events_1 = require("events");
const connections_1 = require("./connections");
const types_1 = require("./types");
class Fleare extends events_1.EventEmitter {
    constructor(host, port, options) {
        super();
        this.host = host;
        this.port = port;
        this.options = options;
        this.state = types_1.ClientState.DISCONNECTED;
        this.connectionPool = new connections_1.ConnectionPool(host, port, options);
        this.connectionPool.on("error", (err) => this.emit("error", err));
        this.connectionPool.on("close", () => this.emit("close"));
    }
    setState(newState) {
        const oldState = this.state;
        this.state = newState;
        this.emit(types_1.ClientState.CHANGE_STATE, newState);
        if (oldState !== newState) {
            if (newState === types_1.ClientState.CONNECTED) {
                this.emit(types_1.ClientState.CONNECTED);
            }
            else if (newState === types_1.ClientState.DISCONNECTED) {
                this.emit(types_1.ClientState.DISCONNECTED);
            }
        }
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state !== types_1.ClientState.DISCONNECTED) {
                return;
            }
            this.setState(types_1.ClientState.CONNECTING);
            try {
                yield this.connectionPool.initialize();
                this.setState(types_1.ClientState.CONNECTED);
            }
            catch (err) {
                this.setState(types_1.ClientState.ERROR);
                this.emit(types_1.ClientState.ERROR, err);
                throw err;
            }
        });
    }
    send(command_1) {
        return __awaiter(this, arguments, void 0, function* (command, args = [], options) {
            if (this.state !== types_1.ClientState.CONNECTED) {
                throw new Error("Client is not connected");
            }
            try {
                return yield this.connectionPool.sendCommand(command, args);
            }
            catch (err) {
                this.emit(types_1.ClientState.ERROR, err);
                throw err;
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state !== types_1.ClientState.CONNECTED) {
                return;
            }
            this.setState(types_1.ClientState.DISCONNECTING);
            try {
                yield this.connectionPool.closeAll();
                this.setState(types_1.ClientState.DISCONNECTED);
            }
            catch (err) {
                this.setState(types_1.ClientState.ERROR);
                this.emit(types_1.ClientState.ERROR, err);
                throw err;
            }
        });
    }
    getState() {
        return this.state;
    }
}
exports.Fleare = Fleare;
//# sourceMappingURL=fleare.js.map