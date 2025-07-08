export interface Options {
    username: string;
    password: string;
    poolSize?: number;
    connectTimeout?: number;
    retryInterval?: number;
    maxRetries?: number;
}
export declare enum ClientState {
    DISCONNECTED = "disconnected",
    CONNECTING = "connecting",
    CONNECTED = "connected",
    DISCONNECTING = "disconnecting",
    CHANGE_STATE = "stateChanged",
    ERROR = "error"
}
