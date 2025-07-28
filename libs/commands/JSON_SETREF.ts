import { Client } from "../client";
/**
 * Sets a JSON value at the specified key and associates it with a reference object.
 *
 * @param key - The key under which the JSON value will be stored.
 * @param value - The JSON object to set at the specified key.
 * @param refObj - The reference object to associate with the value.
 * @returns A promise that resolves with the result of the JSON.SETREF command.
 *
 * @example
 * await client.JSON_SETREF('user:1', { name: 'Alice' }, { ref: 'profile' });
 */
export default async function JSON_SETREF(
  this: Client,
  key: string,
  value: object,
  refObj: object,
): Promise<any> {
  const args: string[] = [];
  args.push(key);
  args.push(JSON.stringify(value));
  args.push(JSON.stringify(refObj));
  return this.executeCommand("JSON.SETREF", args);
}
