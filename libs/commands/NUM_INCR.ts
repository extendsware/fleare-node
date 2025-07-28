import { Client } from "../client";
/**
 * Increments the numeric value of the specified key by the given amount.
 *
 * @param {string} key - The key whose value will be incremented.
 * @param {number} [increment] - The amount to increment by. If omitted, defaults to server behavior.
 * @returns {Promise<any>} Resolves with the server's response to the NUM.INCR command.
 */
export default async function NUM_INCR(
  this: Client,
  key: string,
  increment?: number,
): Promise<any> {
  const args: string[] = [];
  args.push(key);
  if(increment){
    args.push(String(increment));
  }
  
  return this.executeCommand("NUM.INCR", args);
}
