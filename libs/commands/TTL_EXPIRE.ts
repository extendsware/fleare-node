import { Client } from "../client";
/**
 * Sets the expiration time for a given key in the database.
 *
 * @param key - The key to set the expiration for.
 * @param time - The expiration time in seconds or as a string.
 * @returns A promise that resolves with the result of the TTL.EXPIRE command.
 */
export default async function TTL_EXPIRE(
  this: Client,
  key: string,
  time: string | number,
): Promise<any> {
  const args: string[] = [];
  args.push(key);
  args.push(String(time));
  return this.executeCommand("TTL.EXPIRE", args);
}
