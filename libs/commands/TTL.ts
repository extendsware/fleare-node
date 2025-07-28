import { Client } from "../client";
/**
 * Retrieves the remaining time to live (TTL) for a given key in the database.
 *
 * @param key - The key to check the TTL for.
 * @returns A promise that resolves with the TTL value in seconds, or -1 if the key does not have an expiration.
 */
export default async function TTL(
  this: Client,
  key: string,
): Promise<any> {
  const args: string[] = [];
  args.push(key);
  return this.executeCommand("TTL", args);
}
