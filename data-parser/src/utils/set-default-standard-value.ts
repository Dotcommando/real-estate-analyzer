export function setDefaultStandardValue<TDefault extends string, TArray extends string[]>(
  data: { [key: string]: unknown },
  keys: string[],
  standardEnumArray: string[],
  defaultValue: TDefault,
) {
  for (const key of keys) {
    if (!standardEnumArray.includes(data[key] as string)) {
      data[key] = defaultValue;
    }
  }

  return data;
}
