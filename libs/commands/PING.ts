import { Client } from "../client";

/**
 * Sends a PING command to the server using the current client instance.
 *
 * @this {Client} The client instance that sends the PING command.
 * @param {string[]} args - An array of string arguments to send with the PING command.
 * @returns {Promise<any>} A promise that resolves with the server's response to the PING command.
 */
export default async function PING(this: Client, args: string[]): Promise<any> {
  return this.executeCommand("PING", args);
}
