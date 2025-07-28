import { Client } from "../client";
/**
 * Retrieves the element at the specified index from a list stored at the given key.
 *
 * @param key - The key identifying the list.
 * @param index - The zero-based index of the element to retrieve (optional).
 * @returns A promise that resolves with the value at the specified index, or the entire list if index is not provided.
 */
export default async function LIST_GET(
  this: Client,
  key: string,
  index?: number,
): Promise<any> {
  const args: any[] = [];
  args.push(key);
  if (index !== undefined)
    args.push(index);
  return this.executeCommand("LIST.GET", args);
}
