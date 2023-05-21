import { timeoffsetToHumanReadableFormat } from './timeoffset-to-human-readable-format';


const getMultipleLetter = (letter: string, multiplier: number): string => {
  let result = '';

  for (let i = 0; i < multiplier; i++) {
    result += letter;
  }

  return result;
};

export function parseDate(dateToParse: string, format = 'DD.MM.YYYY'): Date {
  if (!dateToParse || typeof dateToParse !== 'string') {
    throw new Error(`Wrong format of the date to parse: ${dateToParse}.`);
  }

  const supportedPatterns = [ 'YYYY', 'YY', 'MM', 'M', 'DD', 'D', 'HH', 'H', 'mm', 'm', 'ss', 's', 'SSS', 'SS', 'S', 'Z' ];
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

  resultDateString += values['YYYY'] || '20' + values['YY'] || today.getFullYear();
  resultDateString += '-';
  resultDateString += values['MM'] || ('0' + values['M']).slice(-2) || ('0' + (today.getMonth() + 1)).slice(-2);
  resultDateString += '-';
  resultDateString += values['DD'] || ('0' + values['D']).slice(-2) || ('0' + today.getDate()).slice(-2);
  resultDateString += 'T';
  resultDateString += values['HH'] || ('0' + values['H']).slice(-2) || ('0' + today.getHours()).slice(-2);
  resultDateString += ':';
  resultDateString += values['mm'] || ('0' + values['m']).slice(-2) || ('0' + today.getMinutes()).slice(-2);
  resultDateString += ':';
  resultDateString += values['ss']
    ? values['ss']
    : values['s']
      ? ('0' + values['s']).slice(-2)
      : ('0' + today.getSeconds()).slice(-2);
  resultDateString += '.';
  resultDateString += values['SSS']
    ? values['SSS']
    : values['SS']
      ? ('0' + values['SS']).slice(-2)
      : values['SSS']
        ? ('00' + values['SSS']).slice(-3)
        : today.getMilliseconds();
  resultDateString += values['Z'] || timeoffsetToHumanReadableFormat(today.getTimezoneOffset());

  return new Date(resultDateString);
}
