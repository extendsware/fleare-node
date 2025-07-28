import { Client } from "../client";

/**
 * Sends a DELETE command to the server using the current client instance.
 *
 * @this {Client} The client instance that sends the DELETE command.
 * @param {string} key The key to delete from the server.
 * @returns {Promise<any>} A promise that resolves with the server's response to the DELETE command.
 */
export default async function DELETE(
  this: Client,
  key: string,
): Promise<any> {
  const args: string[] = [];
  args.push(key);
  return this.executeCommand("DELETE", args);
}
