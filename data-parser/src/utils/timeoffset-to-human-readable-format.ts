export function timeoffsetToHumanReadableFormat(offset: number): string {
  return (offset < 0 ? '+' : '-') + ('0' + Math.abs(Math.floor(offset / 60))).slice(-2) + ':' + ('0' + offset % 60).slice(-2);
}
