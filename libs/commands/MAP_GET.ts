import { Client } from "../client";
/**
 * Retrieves the value of a field (mapKey) from a map stored at the specified key.
 *
 * @param key - The key of the map in the database.
 * @param mapKey - (Optional) The field within the map to retrieve. If omitted, retrieves the entire map.
 * @returns A promise that resolves with the value of the specified field, or the entire map if mapKey is not provided.
 */
export default async function MAP_GET(
  this: Client,
  key: string,
  mapKey?: string,
): Promise<any> {
  const args: string[] = [];
  args.push(key);
  if (mapKey) 
    args.push(mapKey);
  return this.executeCommand("MAP.GET", args);
}
