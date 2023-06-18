export function getMillisecondsLeftUntilNewDay(): number {
  const currentTime = new Date();
  const nextDay = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + 1);

  return nextDay.getTime() - currentTime.getTime();
}
