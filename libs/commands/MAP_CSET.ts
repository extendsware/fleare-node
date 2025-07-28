import { Client } from "../client";
/**
 * Clean key and Sets the value of a field (mapKey) in a map stored at the specified key.
 *
 * @param key - The key of the map in the database.
 * @param mapKey - The field within the map to set.
 * @param value - The value to set for the specified field.
 * @returns A promise that resolves with the result of the MAP.CSET command.
 */
export default async function MAP_CSET(
  this: Client,
  key: string,
  mapKey: string,
  value: any,
): Promise<any> {
  const args: string[] = [];
  args.push(key);
  args.push(mapKey);
  args.push(value);
  return this.executeCommand("MAP.CSET", args);
}
