import { Client } from "../client";
/**
 * Returns the length of the string value stored at the specified key.
 *
 * @param key - The key whose string length is to be retrieved.
 * @returns A promise that resolves to the length of the string value.
 *
 * @example
 * const length = await client.STR_LENGTH('myKey');
 * console.log(length); // Output: 5
 */
export default async function STR_LENGTH(
  this: Client,
  key: string,
): Promise<any> {
  const args: any[] = [];
  args.push(key);
  return this.executeCommand("STR.LENGTH", args);
}
