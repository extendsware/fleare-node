import { Client } from "../client";
/**
 * Sets the specified values at the given key as a list.
 *
 * @param key - The key where the list will be stored.
 * @param value - The values to set in the list.
 * @returns A promise that resolves with the result of the operation.
 */
export default async function LIST_SET(
  this: Client,
  key: string,
  ...value: any[]
): Promise<any> {
  const args: any[] = [];
  args.push(key);
  args.push(...value);
  return this.executeCommand("LIST.SET", args);
}
