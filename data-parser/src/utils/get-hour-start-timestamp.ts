export function getHourStartTimestamp(hoursAgo: number): number {
  if (hoursAgo < 0 || !Number.isInteger(hoursAgo)) {
    throw new Error('The input should be a non-negative integer.');
  }

  const currentDate = new Date();

  currentDate.setHours(currentDate.getHours() - hoursAgo);
  currentDate.setMinutes(0, 0, 0);

  return currentDate.getTime();
}
