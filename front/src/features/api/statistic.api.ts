import { AxiosResponse } from 'axios';

import {
  StatisticGetParameters,
  StatisticResponse,
} from '../statistic/statistic.type';

import { BaseApi } from './base.api';

class StatisticApi extends BaseApi {
  public getStatistic(
    params: StatisticGetParameters,
  ): Promise<AxiosResponse<StatisticResponse, unknown>> {
    return this.get<StatisticResponse, StatisticGetParameters>('stats', params);
  }
}

export const statisticApi = new StatisticApi();
