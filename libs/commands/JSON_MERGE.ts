import { Client } from "../client";
/**
 * Merges a JSON value into the existing value at the specified key in the database.
 *
 * @param key - The key whose JSON value will be merged.
 * @param value - The JSON value to merge into the existing value.
 * @returns A promise that resolves with the result of the JSON.MERGE command.
 *
 * @example
 * await client.JSON_MERGE('user:1', { age: 30 });
 */
export default async function JSON_MERGE(
  this: Client,
  key: string,
  value: any,
): Promise<any> {
  const args: string[] = [];
  args.push(key);
  args.push(value);
  return this.executeCommand("JSON.MERGE", args);
}
