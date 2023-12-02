import { timeoffsetToHumanReadableFormat } from './timeoffset-to-human-readable-format';


export function dateInHumanReadableFormat(date: Date, format = 'DD.MM.YYYY HH:mm:ss SSS'): string {
  const monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
  const YYYY = date.getFullYear().toString();
  const YY = YYYY.slice(-2);
  const M = String(date.getMonth() + 1);
  const MM = ('0' + M).slice(-2);
  const MMM = monthNames[date.getMonth()];
  const D = String(date.getDate());
  const DD = ('0' + D).slice(-2);
  const H = String(date.getHours());
  const HH = ('0' + H).slice(-2);
  const m = String(date.getMinutes());
  const mm = ('0' + m).slice(-2);
  const s = String(date.getSeconds());
  const ss = ('0' + s).slice(-2);
  const SSS = ('000' + date.getMilliseconds()).slice(-3);
  const SS = ('00' + (Math.round(date.getMilliseconds() / 10))).slice(-2);
  const S = String(Math.round(date.getMilliseconds() / 100));
  const offset = date.getTimezoneOffset();
  const Z = timeoffsetToHumanReadableFormat(offset);

  const replacements = {
    'YYYY': '<YYYY>',
    'YY': '<YY>',
    'MMM': '<MMM>',
    'MM': '<MM>',
    'M': '<M>',
    'DD': '<DD>',
    'D': '<D>',
    'HH': '<HH>',
    'H': '<H>',
    'mm': '<mm>',
    'm': '<m>',
    'ss': '<ss>',
    's': '<s>',
    'SSS': '<SSS>',
    'SS': '<SS>',
    'S': '<S>',
    'Z': '<Z>',
  };

  Object.keys(replacements).forEach(key => {
    const negativeLookBehind = '(?<!' + key[0] + ')';
    const negativeLookahead = '(?!' + key[key.length - 1] + ')';

    format = format.replace(new RegExp(negativeLookBehind + key + negativeLookahead, 'g'), replacements[key]);
  });

  format = format
    .replace('<YYYY>', YYYY)
    .replace('<YY>', YY)
    .replace('<MMM>', MMM)
    .replace('<MM>', MM)
    .replace('<M>', M)
    .replace('<DD>', DD)
    .replace('<D>', D)
    .replace('<HH>', HH)
    .replace('<H>', H)
    .replace('<mm>', mm)
    .replace('<m>', m)
    .replace('<ss>', ss)
    .replace('<s>', s)
    .replace('<SSS>', SSS)
    .replace('<SS>', SS)
    .replace('<S>', S)
    .replace('<Z>', Z);

  return format;
}
