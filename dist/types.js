"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientState = void 0;
// export declare interface Listeners {
//     on(event: 'connected', listener: () => void): this;
//     on(event: 'disconnected', listener: () => void): this;
//     on(event: 'error', listener: (err: Error) => void): this;
//     on(event: 'stateChanged', listener: (state: ClientState) => void): this;
//     on(event: string, listener: (...args: any[]) => void): this;
// }
var ClientState;
(function (ClientState) {
    ClientState["DISCONNECTED"] = "disconnected";
    ClientState["CONNECTING"] = "connecting";
    ClientState["CONNECTED"] = "connected";
    ClientState["DISCONNECTING"] = "disconnecting";
    ClientState["CHANGE_STATE"] = "stateChanged";
    ClientState["ERROR"] = "error";
})(ClientState || (exports.ClientState = ClientState = {}));
//# sourceMappingURL=types.js.map