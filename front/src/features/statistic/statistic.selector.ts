import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../../types/store.types';

import { StatisticStore } from './statistic.slice';
import {
  NormalizedStatistic,
  StatisticDataResponse,
  StatisticResponse,
} from './statistic.type';

export const selectStatisticList = createSelector(
  (state: RootState) => state.statistic,
  (statistic) => statistic.data,
);

export const selectNormalizedStatistic = createSelector(
  (state: RootState) => state.statistic,
  ({ data }: StatisticStore): NormalizedStatistic => {
    const normalized = {} as NormalizedStatistic;

    data.forEach((statistic: StatisticResponse) => {
      statistic.data.forEach((statisticDataResponse: StatisticDataResponse) => {
        normalized[
          `${statisticDataResponse.city}_${statisticDataResponse.district}`
        ] = statisticDataResponse;
      });
    });

    return normalized;
  },
);
