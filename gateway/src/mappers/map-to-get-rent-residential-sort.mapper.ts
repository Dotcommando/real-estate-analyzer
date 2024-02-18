import { GetRentResidentialQueryDto } from '../generated/dto/get-residential-query.dto';
import { IGetRentResidentialSort } from '../types';


export function mapToGetRentResidentialSortMapper(dto: GetRentResidentialQueryDto, defaultSort: IGetRentResidentialSort): IGetRentResidentialSort {
  const dtoKeys = Object.keys(dto).filter((key) => key.startsWith('s_'));
  const result: IGetRentResidentialSort = {};

  dtoKeys.forEach((dtoKey) => {
    result[dtoKey.replace(/^s_/, '')] = dto[dtoKey];
  });

  if (!Object.keys(result).length) {
    return defaultSort;
  }

  return result;
}
