import { Client } from "../client";
/**
 * Appends one or more string values to the existing value of the specified key on the server.
 *
 * @param {string} key - The key whose value will be appended to.
 * @param {...string} value - One or more string values to append.
 * @returns {Promise<any>} Resolves with the server's response to the STR.APPEND command.
 */
export default async function STR_APPEND(
  this: Client,
  key: string,
  ...value: string[]
): Promise<any> {
  const args: string[] = [];
  args.push(key);
  args.push(...value);
  return this.executeCommand("STR.APPEND", args);
}
