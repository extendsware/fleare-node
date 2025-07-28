import { Client } from "../client";
/**
 * Sets a value for the specified key on the server using the client instance.
 *
 * @param {string} key - The key to set on the server.
 * @param {any} value - The value to associate with the key.
 * @returns {Promise<any>} Resolves with the server's response to the STR.SET command.
 */
export default async function STR_SET(
  this: Client,
  key: string,
  value: string,
): Promise<any> {
  const args: string[] = [];
  args.push(key);
  args.push(value);
  return this.executeCommand("STR.SET", args);
}
