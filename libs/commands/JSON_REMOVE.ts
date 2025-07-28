import { Client } from "../client";
/**
 * Removes a value from a specified key and path in the database.
 *
 * @param key - The key from which the JSON value will be removed.
 * @param path - The JSON path specifying the value to remove.
 * @returns A promise that resolves with the result of the JSON.REMOVE command.
 *
 * @example
 * await client.JSON_REMOVE('user:1', 'profile.name');
 */
export default async function JSON_REMOVE(
  this: Client,
  key: string,
  path: string,
): Promise<any> {
  const args: string[] = [];
  args.push(key);
  args.push(path);
  return this.executeCommand("JSON.REMOVE", args);
}
