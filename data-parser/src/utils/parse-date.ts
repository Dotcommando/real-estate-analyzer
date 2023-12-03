interface IToken {
  start: number;
  end: number;
  regExpStr: string;
  value: string;
  dateToken: boolean;
  pattern?: string;
}

export function parseDate(
  dateToParse: string,
  format = 'DD.MM.YYYY',
  opts: {
    placeholderChar: string;
    fillRestFromCurrentDate: boolean;
  } = {
    placeholderChar: '\u200B',
    fillRestFromCurrentDate: false,
  },
): Date {
  if (!dateToParse || typeof dateToParse !== 'string') {
    throw new Error(`Wrong format of the date to parse: ${dateToParse}.`);
  }

  const { placeholderChar, fillRestFromCurrentDate } = opts;

  if (placeholderChar.length !== 1) {
    throw new Error('\'placeholderChar\' must have length equal to 1');
  }

  const monthNames = [ 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec' ];
  const patterns = [
    {
      token: 'YYYY',
      minLength: 1,
      maxLength: 4,
      regExpStr: '\\d{4}',
    },
    {
      token: 'YY',
      minLength: 1,
      maxLength: 2,
      regExpStr: '\\d{1,2}',
    },
    {
      token: 'MMM',
      minLength: 3,
      maxLength: 3,
      regExpStr: monthNames.join('|'),
    },
    {
      token: 'MM',
      minLength: 2,
      maxLength: 2,
      regExpStr: '\\d{2}',
    },
    {
      token: 'M',
      minLength: 1,
      maxLength: 2,
      regExpStr: '\\d{1,2}',
    },
    {
      token: 'DD',
      minLength: 2,
      maxLength: 2,
      regExpStr: '\\d{2}',
    },
    {
      token: 'D',
      minLength: 1,
      maxLength: 2,
      regExpStr: '\\d{1,2}',
    },
    {
      token: 'HH',
      minLength: 2,
      maxLength: 2,
      regExpStr: '\\d{2}',
    },
    {
      token: 'H',
      minLength: 1,
      maxLength: 2,
      regExpStr: '\\d{1,2}',
    },
    {
      token: 'mm',
      minLength: 2,
      maxLength: 2,
      regExpStr: '\\d{2}',
    },
    {
      token: 'm',
      minLength: 1,
      maxLength: 2,
      regExpStr: '\\d{1,2}',
    },
    {
      token: 'ss',
      minLength: 2,
      maxLength: 2,
      regExpStr: '\\d{2}',
    },
    {
      token: 's',
      minLength: 1,
      maxLength: 2,
      regExpStr: '\\d{1,2}',
    },
    {
      token: 'SSS',
      minLength: 1,
      maxLength: 3,
      regExpStr: '\\d{1,3}',
    },
    {
      token: 'SS',
      minLength: 2,
      maxLength: 3,
      regExpStr: '\\d{2,3}',
    },
    {
      token: 'S',
      minLength: 1,
      maxLength: 3,
      regExpStr: '\\d{1,3}',
    },
  ];
  const patternTokens = patterns.map(pattern => pattern.token);
  let schema: IToken[] = [];

  let mutableFormat = format;
  const patternTokensLength = patternTokens.length;

  // Date-токены, всякие 'DD', 'MM' и т.п.
  for (let i = 0; i < patternTokensLength; i++) {
    const patternToken = patternTokens[i];

    if (!mutableFormat.includes(patternToken)) {
      continue;
    }

    const token = patterns.find((pattern) => pattern.token === patternToken);
    const patternTokenLength = patternToken.length;

    while (mutableFormat.includes(patternToken)) {
      const start = mutableFormat.indexOf(patternToken);
      const end = start + patternTokenLength;

      schema.push({
        start,
        end,
        regExpStr: token.regExpStr,
        value: '',
        dateToken: true,
        pattern: patternToken,
      });

      mutableFormat = mutableFormat.replace(patternToken, placeholderChar.repeat(patternTokenLength));
    }
  }

  const formatLength = mutableFormat.length;

  schema = schema.sort((a, b) => a.start - b.start);

  let i = 0;

  // Промежутки между Date токенами. Всякие разделяющие '.', ':', '/' и пробелы.
  while (i < formatLength) {
    const foundToken = schema.find((token) => token.start === i);

    if (foundToken) {
      i = foundToken.end;

      continue;
    }

    const nextToken = schema.find((token) => token.start > i);
    const endOfCurrentToken = nextToken
      ? nextToken.start
      : formatLength;
    const value = mutableFormat.substring(i, endOfCurrentToken);

    schema.push({
      start: i,
      end: endOfCurrentToken,
      regExpStr: value
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/\^/g, '\\^')
        .replace(/\./g, '\\.'),
      value,
      dateToken: false,
    });

    i = endOfCurrentToken;
  }

  // Схема сформирована
  schema = schema.sort((a, b) => a.start - b.start);

  let regExpStr = '';
  const dateTokenGroups = {}; // Для хранения соответствия между группами захвата и паттернами
  let groupIndex = 1;

  schema.forEach(token => {
    if (token.dateToken) {
      regExpStr += `(${token.regExpStr})`;
      dateTokenGroups[token.pattern] = groupIndex++;
    } else {
      regExpStr += token.regExpStr;
    }
  });

  const regex = new RegExp(regExpStr, 'i');
  const match = regex.exec(dateToParse);

  if (!match) {
    throw new Error(`Cannot parse date '${dateToParse}' with format '${format}'.`);
  }

  let resultDate: {
    year: number;
    month: number;
    day: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
  };

  if (fillRestFromCurrentDate) {
    const now = new Date();

    resultDate = {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
      milliseconds: now.getMilliseconds(),
    };
  } else {
    resultDate = {
      year: 0,
      month: 0,
      day: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    };
  }

  const tokensToDateMatching = {
    'YYYY': 'year',
    'YY': 'year',
    'MMM': 'month',
    'MM': 'month',
    'M': 'month',
    'DD': 'day',
    'D': 'day',
    'HH': 'hours',
    'H': 'hours',
    'mm': 'minutes',
    'm': 'minutes',
    'ss': 'seconds',
    's': 'seconds',
    'SSS': 'milliseconds',
    'SS': 'milliseconds',
    'S': 'milliseconds',
  };

  schema.forEach((token: IToken) => {
    if (token.dateToken) {
      token.value = match[dateTokenGroups[token.pattern]];

      const parsedValue = parseInt(token.value);

      switch (token.pattern) {
        case 'YYYY':

        case 'YY':
          resultDate[tokensToDateMatching[token.pattern]] = token.pattern === 'YY'
            ? 2000 + parsedValue
            : parsedValue;

          break;

        case 'MMM':
          resultDate.month = monthNames.indexOf(token.value.toLowerCase());

          break;

        case 'MM':

        case 'M':
          resultDate.month = parsedValue - 1;

          break;

        default:
          resultDate[tokensToDateMatching[token.pattern]] = parsedValue;
      }

      if (isNaN(resultDate[tokensToDateMatching[token.pattern]])) {
        throw new Error(`Cannot parse token '${token.pattern}' with value '${token.value}'`);
      }
    }
  });

  return new Date(
    resultDate.year,
    resultDate.month,
    resultDate.day,
    resultDate.hours,
    resultDate.minutes,
    resultDate.seconds,
    resultDate.milliseconds,
  );
}
