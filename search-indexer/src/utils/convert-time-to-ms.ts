export function convertTimeToMilliseconds(timeString: string): number {
  const dayMatch = timeString.match(/(\d+)d/);
  const hourMatch = timeString.match(/(\d+)h/);
  const minuteMatch = timeString.match(/(\d+)m/);

  const days = dayMatch ? parseInt(dayMatch[1]) : 0;
  const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;

  return (days * 24 * 60 + hours * 60 + minutes) * 60 * 1000;
}
