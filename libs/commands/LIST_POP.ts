import { Client } from "../client";
/**
 * Removes and returns the last element from the list stored at the specified key.
 *
 * @param key - The key identifying the list.
 * @returns A promise that resolves with the popped value, or null if the list is empty or does not exist.
 */
export default async function LIST_POP(
  this: Client,
  key: string,
): Promise<any> {
  const args: any[] = [];
  args.push(key);
  return this.executeCommand("LIST.POP", args);
}
