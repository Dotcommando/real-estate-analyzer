export function priceSqm(price: unknown, area: unknown): number {
  try {
    if (typeof price !== 'number' || typeof area !== 'number') return 0;

    if (area === 0) {
      return 0;
    } else if (isNaN(price) || isNaN(area)) {
      return 0;
    }

    const result = Math.round((price / area) * 100) / 100;

    return isNaN(result)
      ? 0
      : result;
  } catch (e) {
    return 0;
  }
}
