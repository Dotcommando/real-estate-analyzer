export function getIntFromEnv(varName: string, defaultValue = 0): number {
  if (!process.env[varName]) {
    return defaultValue;
  }

  try {
    const value = parseInt(process.env[varName] as string);

    return isNaN(value)
      ? defaultValue
      : value;
  } catch (e) {
    return defaultValue;
  }
}
