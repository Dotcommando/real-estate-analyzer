import { Floor, FloorArray } from '../constants';


export function floor(oldFloor: string): Floor | null {
  try {
    if (oldFloor === null) {
      return null;
    }

    if (FloorArray.includes(oldFloor as Floor)) {
      return oldFloor as Floor;
    }

    return null;
  } catch (e) {
    return null;
  }
}
