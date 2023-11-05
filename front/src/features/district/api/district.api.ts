import { BaseApi } from '../../api/base.api';
import { DistrictParams, DistrictsResponse } from '../district.type';

class DistrictApi extends BaseApi {
  public getDistricts(params: DistrictParams): Promise<DistrictsResponse[]> {
    return this.get<DistrictsResponse[], DistrictParams>('/districts', params);
  }
}

export const districtApi = new DistrictApi();
