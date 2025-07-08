// src/connections/index.ts

/**
 * Connections Module
 *
 * Exports all connection-related classes and types for TCP communication
 * with connection pooling support.
 */

export { ConnectionPool } from './connectionPool';
export { Connection } from './connection';

// Export connection-related types
export type { Options } from "../types";

// Export connection events for type safety
export type { ClientState } from "../types";

// Optional: Export constants if you have any
// export { MAX_POOL_SIZE, DEFAULT_TIMEOUT } from './constants';
