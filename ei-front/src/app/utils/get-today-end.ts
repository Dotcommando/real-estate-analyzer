export function getTodayEnd(): Date {
  const today = new Date();

  today.setHours(23, 59, 59, 999);

  return today;
}
