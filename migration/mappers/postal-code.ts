import { stringToInt } from './string-to-int';


export function postalCodeMapper(oldPostalCode: string): number | null {
  return stringToInt(oldPostalCode);
}
