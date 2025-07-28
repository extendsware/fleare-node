import { Client } from "../client";
/**
 * Retrieves a JSON value from the data store for the specified key and path.
 *
 * @param key - The key identifying the JSON document.
 * @param path - (Optional) The JSON path to retrieve. Defaults to the root path ("").
 * @param ref_field - (Optional) Additional reference fields to include in the command arguments.
 * @returns A promise that resolves with the JSON value at the specified path.
 *
 * @example
 * // Retrieve the entire JSON object stored at 'user:1'
 * const result = await client.JSON_GET('user:1');
 *
 * @remarks
 * This function sends a "JSON.GET" command to the underlying data store.
 */
export default async function JSON_GET(
  this: Client,
  key: string,
  path?: string,
  ...ref_field: string[]
): Promise<any> {
  const args: string[] = [];
  args.push(key);
  args.push(path || ""); // Default path is root ""
  args.push(...ref_field || []);
  return this.executeCommand("JSON.GET", args);
}
