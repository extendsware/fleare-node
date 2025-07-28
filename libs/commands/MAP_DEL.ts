import { Client } from "../client";
/**
 * Deletes a field (mapKey) from a map stored at the specified key.
 *
 * @param key - The key of the map in the database.
 * @param mapKey - (Optional) The field within the map to delete. If omitted, deletes the entire map.
 * @returns A promise that resolves with the result of the delete operation.
 */
export default async function MAP_DEL(
  this: Client,
  key: string,
  mapKey?: string,
): Promise<any> {
  const args: string[] = [];
  args.push(key);
  if (mapKey) 
    args.push(mapKey);
  return this.executeCommand("MAP.DEL", args);
}
