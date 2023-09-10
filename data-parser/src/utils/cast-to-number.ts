import { parseNumber } from './parse-number';


export function castToNumber(
  data: { [key: string]: unknown },
  keys: string[],
): { [key: string]: unknown } {
  for (const key of keys) {
    if (key in data) {
      data[key] = parseNumber(data[key]);
    }
  }

  return data;
}
