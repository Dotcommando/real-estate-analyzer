import { BaseApi } from '../../api/base.api';
import { AdsQueryParams, AdsResponse } from '../types/ads.types';

class AdsApi extends BaseApi {
  public getAds(params: AdsQueryParams): Promise<AdsResponse> {
    return this.get<AdsResponse, AdsQueryParams>('/ads', params);
  }
}

export const adsApi = new AdsApi();
