import { CountryEnum } from '../constants';
import { DistrictsDto } from '../dto';
import { IGetDistrictsParams } from '../types';


export function queryGetDistricts(query: DistrictsDto): IGetDistrictsParams {
  return {
    city: query.city,
    country: query.country.trim().toLowerCase() as CountryEnum,
  };
}
