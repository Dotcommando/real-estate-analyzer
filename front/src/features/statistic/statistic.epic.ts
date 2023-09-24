import { filter, ignoreElements, switchMap, tap } from 'rxjs';

import { StoreEpic } from '../../types/store.types';
import { statisticApi } from '../api/statistic.api';
import { setLoader } from '../loader/loader.slice';

import { initStatistic, setStatistic } from './statistic.slice';
import {
  AdsEnum,
  AnalysisPeriod,
  AnalysisType,
  StatisticResponse,
} from './statistic.type';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const statisticEpic: StoreEpic = (action$, state$, { dispatch }) =>
  action$.pipe(
    filter(initStatistic.match),
    tap(() => dispatch(setLoader({ key: 'objects', state: 'loading' }))),
    switchMap(() => {
      return statisticApi
        .getStatistic({
          startDate: '2023-09-01',
          endDate: '2023-09-31',
          analysisType: AnalysisType.CITY_AVG_MEAN,
          analysisPeriod: AnalysisPeriod.DAILY_TOTAL,
          ads: AdsEnum.SaleFlats,
        })
        .catch((e) => {
          console.error(e);

          return [];
        });
    }),
    tap(() => dispatch(setLoader({ key: 'objects', state: 'loaded' }))),
    tap((response) => {
      console.log(11, response);
      dispatch(setStatistic(response as StatisticResponse[]));
    }),
    ignoreElements(),
  );
