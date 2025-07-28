import { Client } from "../client";
/**
 * Retrieves a substring from the string value stored at the specified key, 
 * starting from the given start index and ending at the given end index.
 *
 * @param key - The key of the string value to retrieve the range from.
 * @param start - The zero-based starting index of the substring.
 * @param end - The zero-based ending index of the substring (inclusive).
 * @returns A promise that resolves with the substring result.
 */
export default async function STR_RANGE(
  this: Client,
  key: string,
  start: number,
  end: number
): Promise<any> {
  const args: any[] = [];
  args.push(key);
  args.push(start);
  args.push(end);
  return this.executeCommand("STR.RANGE", args);
}
