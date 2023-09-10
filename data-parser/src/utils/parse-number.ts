export function parseNumber(value: unknown): number {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }

  if (typeof value === 'number' && isNaN(value)) {
    return 0;
  }

  const result = parseFloat(String(value).replace(/[^\d.]/, ''));

  return isNaN(result)
    ? 0
    : result;
}
