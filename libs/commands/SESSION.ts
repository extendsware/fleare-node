import { Client } from "../client";

/**
 * Sends a SESSION command to the server using the current client instance.
 *
 * @this {Client} The client instance that sends the SESSION command.
 * @returns {Promise<any>} A promise that resolves with the server's response to the SESSION command.
 */
export default async function SESSION(this: Client): Promise<any> {
  return this.executeCommand("SESSION");
}
