import { Client } from "../client";

/**
 * Sends a GET command to the server using the current client instance.
 *
 * @this {Client} The client instance that sends the GET command.
 * @param {string} key The key to retrieve from the server.
 * @returns {Promise<any>} A promise that resolves with the server's response to the GET command.
 */
export default async function EXISTS(
  this: Client,
  ...keys: string[]
): Promise<any> {
  return this.executeCommand("EXISTS", keys);
}
