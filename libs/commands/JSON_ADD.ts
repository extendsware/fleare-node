import { Client } from "../client";
/**
 * Adds a JSON value to a specified key and path in the database.
 *
 * @param key - The key under which the JSON value will be stored.
 * @param path - The JSON path where the value should be added.
 * @param value - The value to add at the specified path.
 * @returns A promise that resolves with the result of the JSON.ADD command.
 *
 * @example
 * await client.JSON_ADD('user:1', 'profile', { name: 'Alice' });
 */
export default async function JSON_ADD(
  this: Client,
  key: string,
  path: string,
  value: any,
): Promise<any> {
  const args: string[] = [];
  args.push(key);
  args.push(path);
  args.push(value);
  return this.executeCommand("JSON.ADD", args);
}
