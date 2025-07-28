import { Client } from "../client";
/**
 * Retrieves the string value stored at the specified key.
 *
 * @param key - The key of the string value to retrieve.
 * @returns A promise that resolves with the string value.
 */
export default async function STR_GET(
  this: Client,
  key: string,
): Promise<any> {
  const args: any[] = [];
  args.push(key);
  return this.executeCommand("STR.GET", args);
}
