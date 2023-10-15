export function getDayStartTimestamp(daysAgo: number): number {
  if (daysAgo < 0 || !Number.isInteger(daysAgo)) {
    throw new Error('The input should be a non-negative integer.');
  }

  const currentDate = new Date();

  currentDate.setDate(currentDate.getDate() - daysAgo);
  currentDate.setHours(0, 0, 0, 0);

  return currentDate.getTime();
}
