export function getHourBoundariesForDay(date: Date, hour: number): [number, number] {
  const startDate = new Date(date);

  startDate.setHours(hour, 0, 0, 0);

  const endDate = new Date(startDate);

  endDate.setHours(hour + 1, 0, 0, 0);

  return [ startDate.getTime(), endDate.getTime() ];
}

export function getDayStructure(date: Date): { events: { [key: string]: [number, number] }; date: Date } {
  const structure: { [key: string]: [number, number] } = {};

  for (let hour = 0; hour < 24; hour++) {
    structure[hour.toString()] = getHourBoundariesForDay(date, hour);
  }

  return {
    date,
    events: structure,
  };
}

export function generateHourlyEventBoundaries(days: number): Array<{ events: { [key: string]: [number, number] }; date: Date }> {
  const today = new Date();
  const result: Array<{ events: { [key: string]: [number, number] }; date: Date }> = [];

  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < days; i++) {
    const currentDate = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000));

    result.push(getDayStructure(currentDate));
  }

  return result;
}
