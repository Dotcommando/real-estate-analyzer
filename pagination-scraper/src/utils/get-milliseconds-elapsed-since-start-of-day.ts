export function getMillisecondsElapsedSinceStartOfDay(): number {
  const currentTime = new Date();
  const startOfDay = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());

  return currentTime.getTime() - startOfDay.getTime();
}
