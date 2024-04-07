import { ApartmentsFlatsType, ApartmentsFlatsTypeArray, HousesType, HousesTypeArray } from '../constants';


export function subcategory(type: string): HousesType | ApartmentsFlatsType {
  if (!ApartmentsFlatsTypeArray.includes(type as ApartmentsFlatsType) && !HousesTypeArray.includes(type as HousesType)) {
    return HousesType.NotSpecified;
  }

  return type as ApartmentsFlatsType | HousesType;
}
