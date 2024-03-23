export function getInteger(value: number | string | undefined | null, defaultValue = 0): number {
  if (typeof value === 'number') {
    return !isNaN(value) && value !== Infinity && value !== -Infinity
      ? Math.round(value)
      : defaultValue;
  }

  if (typeof value === 'undefined' || value === null) {
    return defaultValue;
  }

  const parsed = parseInt(value as string);

  return !isNaN(parsed)
    ? Math.round(parsed)
    : defaultValue;
}
