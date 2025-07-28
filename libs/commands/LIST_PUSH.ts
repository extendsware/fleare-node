import { Client } from "../client";
/**
 * Appends one or more values to the end of the list stored at the specified key.
 *
 * @param key - The key identifying the list.
 * @param value - One or more values to append to the list.
 * @returns A promise that resolves with the result of the push operation.
 */
export default async function LIST_PUSH(
  this: Client,
  key: string,
  ...value: any[]
): Promise<any> {
  const args: any[] = [];
  args.push(key);
  args.push(...value);
  return this.executeCommand("LIST.PUSH", args);
}
