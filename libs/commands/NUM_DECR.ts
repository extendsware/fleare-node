import { Client } from "../client";
/**
 * Decrements the numeric value associated with the specified key on the server.
 *
 * @param {string} key - The key whose value will be decremented.
 * @param {number} [decr] - The amount to decrement by. If not provided, defaults to 1.
 * @returns {Promise<any>} Resolves with the server's response to the NUM.DECR command.
 */
export default async function NUM_DECR(
  this: Client,
  key: string,
  decr?: number,
): Promise<any> {
  const args: string[] = [];
  args.push(key);
  if(decr){
    args.push(String(decr));
  }
  
  return this.executeCommand("NUM.DECR", args);
}
