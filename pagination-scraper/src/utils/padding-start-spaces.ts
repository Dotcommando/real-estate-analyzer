export function paddingStartSpaces(input: any, minLength: number): string {
  const inputString = typeof input === 'string'
    ? input
    : String(input);

  if (inputString.length < minLength) {
    return inputString.padStart(minLength, ' ');
  }

  return inputString;
}
