import createClientFunction, { Client } from "./client";

// Export types
export * from "./types";
export { Client };

// Named export of createClient function
export const createClient = createClientFunction;

// Default export that supports multiple import patterns
const fleare = {
  createClient: createClientFunction,
  Client,
};

// Default export for CommonJS compatibility
export default fleare;

// For CommonJS require() compatibility
module.exports = fleare;
module.exports.default = fleare;
module.exports.createClient = createClientFunction;
module.exports.Client = Client;
