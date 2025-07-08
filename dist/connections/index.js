"use strict";
// src/connections/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = exports.ConnectionPool = void 0;
/**
 * Connections Module
 *
 * Exports all connection-related classes and types for TCP communication
 * with connection pooling support.
 */
var connectionPool_1 = require("./connectionPool");
Object.defineProperty(exports, "ConnectionPool", { enumerable: true, get: function () { return connectionPool_1.ConnectionPool; } });
var connection_1 = require("./connection");
Object.defineProperty(exports, "Connection", { enumerable: true, get: function () { return connection_1.Connection; } });
// Optional: Export constants if you have any
// export { MAX_POOL_SIZE, DEFAULT_TIMEOUT } from './constants';
//# sourceMappingURL=index.js.map