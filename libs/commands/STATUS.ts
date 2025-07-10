import { Client } from "../client";

/**
 * Sends a STATUS command to the server using the current client instance.
 *
 * @this {Client} The client instance that sends the STATUS command.
 * @returns {Promise<any>} A promise that resolves with the server's response to the STATUS command.
 */
export default async function STATUS(this: Client): Promise<any> {
  return this.executeCommand("STATUS");
}
