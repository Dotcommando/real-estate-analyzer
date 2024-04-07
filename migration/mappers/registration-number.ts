import { stringToInt } from './string-to-int';


export function registrationNumber(oldRegistrationNumber: string | number): number | null {
  return stringToInt(oldRegistrationNumber);
}
