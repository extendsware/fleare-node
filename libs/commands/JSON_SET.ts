import { Client } from "../client";
/**
 * Sets a JSON value for the specified key in the database.
 *
 * @param key - The key under which the JSON value will be stored.
 * @param value - The JSON value to set for the key.
 * @returns A promise that resolves with the result of the JSON.SET command.
 */
export default async function JSON_SET(
  this: Client,
  key: string,
  value: any,
): Promise<any> {
  const args: string[] = [];
  args.push(key);
  args.push(value);
  return this.executeCommand("JSON.SET", args);
}
