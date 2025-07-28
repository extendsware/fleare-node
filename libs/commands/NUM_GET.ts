import { Client } from "../client";
/**
 * Retrieves the numeric value associated with the specified key from the server.
 *
 * @param {string} key - The key whose numeric value should be retrieved.
 * @returns {Promise<any>} Resolves with the server's response to the NUM.GET command.
 */
export default async function NUM_GET(
  this: Client,
  key: string,
): Promise<any> {
  const args: string[] = [];
  args.push(key);
  return this.executeCommand("NUM.GET", args);
}
