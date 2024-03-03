export function getYearAgo(): Date {
  const yearAgoDate = new Date();

  yearAgoDate.setFullYear(yearAgoDate.getFullYear() - 1);
  yearAgoDate.setHours(0, 0, 0, 0);

  return yearAgoDate;
}
