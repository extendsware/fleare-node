import { Client } from "../client";
/**
 * Returns the length of the list stored at the specified key.
 *
 * @param key - The key identifying the list.
 * @returns A promise that resolves with the length of the list.
 */
export default async function LIST_LEN(
  this: Client,
  key: string,
): Promise<any> {
  const args: any[] = [];
  args.push(key);
  return this.executeCommand("LIST.LEN", args);
}
