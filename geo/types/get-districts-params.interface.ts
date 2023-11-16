import { CountryEnum } from '../constants';


export interface IGetDistrictsParams {
  country: CountryEnum;
  city?: string;
}
