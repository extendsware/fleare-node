import { EventEmitter } from 'events';

export interface Options {
    username?: string;
    password?: string;
    poolSize?: number;
    connectTimeout?: number;
    retryInterval?: number;
    maxRetries?: number;
}

// export declare interface Listeners {
//     on(event: 'connected', listener: () => void): this;
//     on(event: 'disconnected', listener: () => void): this;
//     on(event: 'error', listener: (err: Error) => void): this;
//     on(event: 'stateChanged', listener: (state: ClientState) => void): this;
//     on(event: string, listener: (...args: any[]) => void): this;
// }

export enum ClientState {
    DISCONNECTED = 'disconnected',
    CONNECTING = 'connecting',
    CONNECTED = 'connected',
    DISCONNECTING = 'disconnecting',
    CHANGE_STATE = 'stateChanged',
    ERROR = 'error'
}