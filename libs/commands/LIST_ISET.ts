import { Client } from "../client";
/**
 * Sets the element at the specified index in a list stored at the given key to the provided value.
 *
 * @param key - The key identifying the list.
 * @param index - The zero-based index at which to set the value.
 * @param value - The value to set at the specified index.
 * @returns A promise that resolves with the result of the LIST.ISET command.
 *
 * @remarks
 * This method sends the `LIST.ISET` command to the underlying data store.
 * If the index is out of range, the command may fail depending on the backend implementation.
 *
 * @example
 * ```typescript
 * await client.LIST_ISET('myList', 2, 'newValue');
 * ```
 */
export default async function LIST_ISET(
  this: Client,
  key: string,
  index: number,
  value: any
): Promise<any> {
  const args: any[] = [];
  args.push(key);
  args.push(index);
  args.push(value);
  return this.executeCommand("LIST.ISET", args);
}
