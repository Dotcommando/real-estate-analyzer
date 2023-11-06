import { PayloadAction } from '@reduxjs/toolkit';
import { filter, ignoreElements, switchMap, tap } from 'rxjs';

import { StoreEpic } from '../../types/store.types';
import { statisticApi } from '../api/statistic.api';
import { selectBestPricesAdsType } from '../best-prices/best-prices.selector';
import { setLoader } from '../loader/loader.slice';

import {
  initStatistic,
  setStatistic,
  StatisticInitPayload,
} from './statistic.slice';
import { AnalysisPeriod, StatisticResponse } from './statistic.type';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const statisticEpic: StoreEpic = (action$, state$, { dispatch }) =>
  action$.pipe(
    filter(initStatistic.match),
    tap(() => dispatch(setLoader({ key: 'objects', state: 'loading' }))),
    switchMap((action: PayloadAction<StatisticInitPayload>) => {
      return statisticApi
        .getStatistic({
          startDate: action.payload.startDate,
          endDate: action.payload.endDate,
          analysisType: action.payload.analysisType,
          analysisPeriod: AnalysisPeriod.DAILY_TOTAL,
          ads: selectBestPricesAdsType(state$.value),
        })
        .catch((e) => {
          console.error(e);

          return [];
        });
    }),
    tap(() => dispatch(setLoader({ key: 'objects', state: 'loaded' }))),
    tap((response) => {
      dispatch(setStatistic(response as StatisticResponse[]));
    }),
    ignoreElements(),
  );
