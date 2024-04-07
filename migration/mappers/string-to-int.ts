export function stringToInt(val: string | number): number | null {
  try {
    if (typeof val === 'number') {
      return val;
    } else if (typeof val !== 'string') {
      return null;
    }

    const postalCode = parseInt(val);

    return String(postalCode) === val
      ? postalCode
      : null;
  } catch (e) {
    return null;
  }
}
