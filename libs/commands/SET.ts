import { Client } from "../client";

/**
 * Sends a SET command to the server using the current client instance.
 *
 * @this {Client} The client instance that sends the SET command.
 * @param {string} key The key to retrieve from the server.
 * @param {any} value The value to set for the key.
 * @returns {Promise<any>} A promise that resolves with the server's response to the SET command.
 */
export default async function SET(
  this: Client,
  key: string,
  value: any,
): Promise<any> {
  const args: string[] = [];
  args.push(key);
  args.push(value);
  return this.executeCommand("SET", args);
}
