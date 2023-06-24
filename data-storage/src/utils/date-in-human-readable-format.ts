import { timeoffsetToHumanReadableFormat } from './timeoffset-to-human-readable-format';


export function dateInHumanReadableFormat(date: Date, format = 'DD.MM.YYYY HH:mm:ss SSS'): string {
  const YYYY = date.getFullYear().toString();
  const YY = YYYY.slice(-2);
  const M = String(date.getMonth() + 1);
  const MM = ('0' + M).slice(-2);
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

  return format
    .replace(/YYYY/g, YYYY)
    .replace(/YY/g, YY)
    .replace(/MM/g, MM)
    .replace(/M/g, M)
    .replace(/DD/g, DD)
    .replace(/D/g, D)
    .replace(/HH/g, HH)
    .replace(/H/g, H)
    .replace(/mm/g, mm)
    .replace(/m/g, m)
    .replace(/ss/g, ss)
    .replace(/s/g, s)
    .replace(/SSS/g, SSS)
    .replace(/SS/g, SS)
    .replace(/S/g, S)
    .replace(/Z/g, Z);
}
