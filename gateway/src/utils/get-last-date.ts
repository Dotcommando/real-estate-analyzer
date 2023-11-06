export const getLastDate = (dates) => ([ dates.reduce((latest, current) => {
  const latestDate = new Date(latest);
  const currentDate = new Date(current);
  
  if (latestDate < currentDate) {
    return current;
  }
  
  return latest;
}) ]);
  