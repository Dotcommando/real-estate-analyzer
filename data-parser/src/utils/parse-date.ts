export function parseDate(
  dateToParse: string,
  format = 'DD.MM.YYYY',
  fillRestFromCurrentDate = false,
): Date {
  if (!dateToParse || typeof dateToParse !== 'string') {
    throw new Error(`Wrong format of the date to parse: ${dateToParse}.`);
  }

  const monthNames = [ 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec' ];
  const supportedPatterns = [ 'YYYY', 'YY', 'MMM', 'MM', 'M', 'DD', 'D', 'HH', 'H', 'mm', 'm', 'ss', 's', 'SSS', 'SS', 'S' ];
  const values = {};

  let mutableFormat = format;

  supportedPatterns.forEach(pattern => {
    const regex = new RegExp(pattern);
    const match = regex.exec(mutableFormat);

    if (match) {
      values[pattern] = dateToParse.substring(match.index, match.index + pattern.length);
      mutableFormat = mutableFormat.replace(pattern, 'X'.repeat(pattern.length));
    }
  });

  const today = new Date();
  const year = values['YYYY']
    ? parseInt(values['YYYY'])
    : (values['YY']
      ? 2000 + parseInt(values['YY'])
      : today.getFullYear());
  const month = values['MM']
    ? parseInt(values['MM'], 10) - 1
    : (values['M']
      ? parseInt(values['M'], 10) - 1
      : (values['MMM']
        ? monthNames.indexOf(values['MMM'].toLowerCase())
        : (fillRestFromCurrentDate ? today.getMonth() : 0)));
  const day = values['DD']
    ? parseInt(values['DD'])
    : (values['D']
      ? parseInt(values['D'])
      : (fillRestFromCurrentDate ? today.getDate() : 1));
  const hours = values['HH']
    ? parseInt(values['HH'])
    : (values['H']
      ? parseInt(values['H'])
      : (fillRestFromCurrentDate ? today.getHours() : 0));
  const minutes = values['mm']
    ? parseInt(values['mm'])
    : (values['m']
      ? parseInt(values['m'])
      : (fillRestFromCurrentDate ? today.getMinutes() : 0));
  const seconds = values['ss']
    ? parseInt(values['ss'])
    : (values['s']
      ? parseInt(values['s'])
      : (fillRestFromCurrentDate ? today.getSeconds() : 0));
  const ms = values['SSS']
    ? parseInt(values['SSS'])
    : values['SS']
      ? parseInt(values['SS']) * 10
      : values['S']
        ? parseInt(values['S']) * 100
        : (fillRestFromCurrentDate ? today.getMilliseconds() : 0);

  return new Date(year, month, day, hours, minutes, seconds, ms);
}
