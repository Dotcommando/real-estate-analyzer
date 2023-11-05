export function getPriceDifference(
  targetPrice: number,
  currentPrice: number,
): number {
  return Math.round(((currentPrice - targetPrice) / targetPrice) * 100);
}

export function getPercentColor(
  targetPrice: number,
  currentPrice: number,
): string {
  const percentDifference = getPriceDifference(targetPrice, currentPrice);

  const AVERAGE_OFFSET = 5;
  const FIRST_OFFSET = 10;
  const SECOND_OFFSET = 15;

  if (percentDifference <= -SECOND_OFFSET) {
    return 'color-very-cheap';
  }

  if (percentDifference >= SECOND_OFFSET) {
    return 'color-very-expensive';
  }

  if (percentDifference <= -FIRST_OFFSET) {
    return 'color-cheap';
  }

  if (percentDifference >= FIRST_OFFSET) {
    return 'color-expensive';
  }

  if (
    percentDifference >= -AVERAGE_OFFSET ||
    percentDifference <= AVERAGE_OFFSET
  ) {
    return 'color-average';
  }

  return '';
}
