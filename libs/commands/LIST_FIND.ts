import { Client } from "../client";
/**
 * Finds and returns the element(s) in a list at the specified key and path.
 *
 * @param key - The key identifying the list.
 * @param path - The path within the list to search for the element(s).
 * @returns A promise that resolves with the found element(s) at the specified path.
 */
export default async function LIST_FIND(
  this: Client,
  key: string,
  path: string,
): Promise<any> {
  const args: any[] = [];
  args.push(key);
  args.push(path);
  return this.executeCommand("LIST.FIND", args);
}
