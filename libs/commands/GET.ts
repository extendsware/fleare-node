import { Client } from "../client";

/**
 * Sends a GET command to the server using the current client instance.
 *
 * @this {Client} The client instance that sends the GET command.
 * @param {string} key The key to retrieve from the server.
 * @returns {Promise<any>} A promise that resolves with the server's response to the GET command.
 */
export default async function GET(
  this: Client,
  key: string,
  path?: string,
): Promise<any> {
  const args: string[] = [];
  args.push(key);
  if (path !== undefined) {
    args.push(path);
  }
  return this.executeCommand("GET", args);
}
