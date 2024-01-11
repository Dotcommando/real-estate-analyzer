export function isObjectOrArray(value: unknown): boolean {
  return Array.isArray(value) || value instanceof Object;
}

export function deepFreeze(value: { [key: string]: unknown } | unknown[]): { [key: string]: unknown } | readonly unknown[] {
  if (Array.isArray(value)) {
    const frozenArray = [];
    const arrayLength = frozenArray.length;

    for (let i = 0; i < arrayLength; i++) {
      frozenArray.push(isObjectOrArray(value[i]) ? deepFreeze(value[i]) : value[i]);
    }

    return Object.freeze(frozenArray);
  }

  const frozenObject = {};

  for (const key in value) {
    frozenObject[key] = isObjectOrArray(value[key])
      ? deepFreeze({ ...(value[key] as { [key: string]: unknown }) })
      : value[key];
  }

  return frozenObject;
}
