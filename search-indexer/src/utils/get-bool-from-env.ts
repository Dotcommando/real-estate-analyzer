export function getBoolFromEnv(varName: string, defaultValue = false): boolean {
  try {
    if (!process.env[varName]) {
      return defaultValue;
    }

    return process.env[varName] === 'true'
      || process.env[varName] === 'on'
      || process.env[varName] === '1';
  } catch (e) {
    return defaultValue;
  }
}
