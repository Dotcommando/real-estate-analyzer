export function isObjectOrArray(value: unknown): boolean {
  return Array.isArray(value) || value instanceof Object;
}

export function deepFreeze(value: { [key: string]: unknown } | unknown[]): { [key: string]: unknown } | readonly unknown[] {
  if (Array.isArray(value)) {
    const frozenArray = [];
    const arrayLength = value.length;

    for (let i = 0; i < arrayLength; i++) {
      frozenArray.push(
        (isObjectOrArray(value[i]) && !(value[i] instanceof Date))
          ? deepFreeze(value[i] as { [key: string]: unknown } | unknown[])
          : value[i],
      );
    }

    return Object.freeze(frozenArray);
  }

  const frozenObject = {};

  for (const key in value) {
    frozenObject[key] = (isObjectOrArray(value[key]) && !(value[key] instanceof Date))
      ? deepFreeze({ ...(value[key] as { [key: string]: unknown }) })
      : value[key];
  }

  return frozenObject;
}
