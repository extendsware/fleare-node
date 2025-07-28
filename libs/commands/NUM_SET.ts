import { Client } from "../client";
/**
 * Sets a numeric value for the specified key on the server.
 *
 * @param {string} key - The key to set.
 * @param {number} value - The numeric value to associate with the key.
 * @returns {Promise<any>} Resolves with the server's response to the NUM.SET command.
 */
export default async function NUM_SET(
  this: Client,
  key: string,
  value: number,
): Promise<any> {
  const args: string[] = [];
  args.push(key);
  args.push(String(value));
  return this.executeCommand("NUM.SET", args);
}
