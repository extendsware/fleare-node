import { Client } from "../client";
/**
 * Updates the element at the specified path in a list stored at the given key to the provided value.
 *
 * @param key - The key identifying the list.
 * @param path - The path or index at which to update the value.
 * @param value - The value to set at the specified path.
 * @returns A promise that resolves with the result of the LIST.UPDATE command.
 *
 * @remarks
 * This method sends the `LIST.UPDATE` command to the underlying data store.
 * If the path is invalid, the command may fail depending on the backend implementation.
 *
 * @example
 * ```typescript
 * await client.LIST_UPDATE('myList', '2', 'newValue');
 * ```
 */
export default async function LIST_UPDATE(
  this: Client,
  key: string,
  path: string,
  value: any
): Promise<any> {
  const args: any[] = [key, path, value];
  return this.executeCommand("LIST.UPDATE", args);
}
