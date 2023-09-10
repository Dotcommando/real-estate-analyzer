import { roundDate } from './round-date';


export function getRoundYesterday(): Date {
  return roundDate(new Date(+(new Date()) - (24 * 60 * 60 * 1000)));
}
