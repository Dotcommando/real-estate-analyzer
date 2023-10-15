import { ignoreElements, switchMap, tap } from 'rxjs';

import { ofAction } from '../../operators/of-action.operator';
import { RealEstateObject } from '../../types/real-estate.type';
import { StoreEpic } from '../../types/store.types';
import { dateInHumanReadableFormat } from '../../utils/date-in-human-readable-format';
import { adsApi } from '../ads/api/ads.api';
import { setLoader } from '../loader/loader.slice';
import { initStatistic } from '../statistic/statistic.slice';

import {
  selectBestPricesAdsType,
  selectBestPricesPage,
} from './best-prices.selector';
import {
  initBestPrices,
  setBestPrices,
  setBestPricesAdsType,
  setBestPricesPage,
  setBestPricesSelectedCity,
} from './best-prices.slice';

const DEFAULT_LIMIT = 52;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const bestPricesEpic: StoreEpic = (action$, state$, { dispatch }) =>
  action$.pipe(
    ofAction([
      initBestPrices,
      setBestPricesSelectedCity,
      setBestPricesAdsType,
      setBestPricesPage,
    ]),
    tap(() => {
      dispatch(
        setLoader({
          key: 'best-prices',
          state: 'loading',
        }),
      );
    }),
    switchMap((action) => {
      const currentPage = selectBestPricesPage(state$.value);

      const date = new Date();

      date.setDate(date.getDate() - 1);

      const previousDay = dateInHumanReadableFormat(date, 'YYYY-MM-DD');

      const currentDay = dateInHumanReadableFormat(new Date(), 'YYYY-MM-DD');

      dispatch(
        initStatistic({
          startDate: previousDay,
          endDate: currentDay,
        }),
      );

      const isSelectedCityAction = setBestPricesSelectedCity.match(action);

      return adsApi.getAds({
        startDate: previousDay,
        ads: selectBestPricesAdsType(state$.value),
        limit: DEFAULT_LIMIT,
        offset: currentPage !== 1 ? currentPage * DEFAULT_LIMIT : 0,
        city:
          isSelectedCityAction && action.payload && action.payload !== 'All'
            ? action.payload
            : undefined,
      });
    }),
    tap(() => {
      dispatch(
        setLoader({
          key: 'best-prices',
          state: 'loaded',
        }),
      );
    }),
    tap((response) => dispatch(setBestPrices(response as RealEstateObject[]))),
    ignoreElements(),
  );
