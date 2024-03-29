import { IDistrictOption } from './district-option.interface';


export interface ICityDistrict {
  city: string | null;
  districts: IDistrictOption[] | null;
}
