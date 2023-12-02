export function parseInteger(value: unknown, defaultValue = 0): number {
  try {
    if (typeof value === 'number' && !isNaN(value)) {
      return parseInt(String(value));
    }

    if (typeof value === 'number' && isNaN(value)) {
      return defaultValue;
    }

    const result = parseInt(String(value));

    return isNaN(result)
      ? defaultValue
      : result;
  } catch (e) {
    return defaultValue;
  }
}
