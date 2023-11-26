import { timeoffsetToHumanReadableFormat } from './timeoffset-to-human-readable-format';


const getMultipleLetter = (letter: string, multiplier: number): string => {
  let result = '';

  for (let i = 0; i < multiplier; i++) {
    result += letter;
  }

  return result;
};

export function parseDate(
  dateToParse: string,
  format = 'DD.MM.YYYY',
  fillRestFromCurrentDate = false,
): Date {
  if (!dateToParse || typeof dateToParse !== 'string') {
    throw new Error(`Wrong format of the date to parse: ${dateToParse}.`);
  }

  const monthNames = [ 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec' ];
  const supportedPatterns = [ 'YYYY', 'YY', 'MMM', 'MM', 'M', 'DD', 'D', 'HH', 'H', 'mm', 'm', 'ss', 's', 'SSS', 'SS', 'S', 'Z' ];
  const sortedByLengthPatterns = supportedPatterns.sort((a, b) => a.length > b.length
    ? -1
    : a.length === b.length
      ? 0
      : 1,
  );

  const values = {};

  let mutableFormat = format;

  for (const pattern of sortedByLengthPatterns) {
    const startIndex = mutableFormat.indexOf(pattern);

    if (startIndex === -1) continue;

    values[pattern] = dateToParse.substring(startIndex, startIndex + pattern.length);
    mutableFormat = mutableFormat.replace(pattern, getMultipleLetter('X', pattern.length));
  }

  let resultDateString = '';

  const today = new Date();

  resultDateString += values['YYYY']
    ? values['YYYY']
    : values['YY']
      ? '20' + values['YY']
      : today.getFullYear();
  resultDateString += '-';
  resultDateString += values['MM']
    ? values['MM']
    : values['M']
      ? ('0' + values['M']).slice(-2)
      : values['MMM']
        ? ('0' + (monthNames.findIndex(m => m.toLowerCase() === values['MMM']) + 1)).slice(-2)
        : fillRestFromCurrentDate
          ? ('0' + String(today.getMonth() + 1)).slice(-2)
          : '01';
  resultDateString += '-';
  resultDateString += values['DD']
    ? values['DD']
    : values['D']
      ? ('0' + values['D']).slice(-2)
      : fillRestFromCurrentDate
        ? ('0' + String(today.getDate())).slice(-2)
        : '01';
  resultDateString += 'T';
  resultDateString += values['HH']
    ? values['HH']
    : values['H']
      ? ('0' + values['H']).slice(-2)
      : fillRestFromCurrentDate
        ? ('0' + String(today.getHours())).slice(-2)
        : '00';
  resultDateString += ':';
  resultDateString += values['mm']
    ? values['mm']
    : values['m']
      ? ('0' + values['m']).slice(-2)
      : fillRestFromCurrentDate
        ? ('0' + String(today.getMinutes())).slice(-2)
        : '00';
  resultDateString += ':';
  resultDateString += values['ss']
    ? values['ss']
    : values['s']
      ? ('0' + values['s']).slice(-2)
      : fillRestFromCurrentDate
        ? ('0' + String(today.getSeconds())).slice(-2)
        : '00';
  resultDateString += '.';
  resultDateString += values['SSS']
    ? values['SSS']
    : values['SS']
      ? ('0' + values['SS']).slice(-2)
      : values['SSS']
        ? ('00' + values['SSS']).slice(-3)
        : fillRestFromCurrentDate
          ? String(today.getMilliseconds())
          : '000';
  resultDateString += values['Z'] ?? timeoffsetToHumanReadableFormat(today.getTimezoneOffset());

  return new Date(resultDateString);
}
