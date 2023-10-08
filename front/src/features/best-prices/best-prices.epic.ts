import { ignoreElements, switchMap, tap } from 'rxjs';

import { ofAction } from '../../operators/of-action.operator';
import { RealEstateObject } from '../../types/real-estate.type';
import { StoreEpic } from '../../types/store.types';
import { adsApi } from '../ads/api/ads.api';
import { setLoader } from '../loader/loader.slice';

import { selectBestPricesAdsType } from './best-prices.selector';
import {
  initBestPrices,
  setBestPrices,
  setBestPricesAdsType,
  setBestPricesSelectedCity,
} from './best-prices.slice';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const bestPricesEpic: StoreEpic = (action$, state$, { dispatch }) =>
  action$.pipe(
    ofAction([initBestPrices, setBestPricesSelectedCity, setBestPricesAdsType]),
    tap(() => dispatch(setLoader({ key: 'best-prices', state: 'loading' }))),
    switchMap((action) => {
      console.log(11, state$.value);

      return adsApi.getAds({
        startDate: '2023-09-01',
        ads: selectBestPricesAdsType(state$.value),
        limit: 50,
        city:
          setBestPricesSelectedCity.match(action) &&
          action.payload &&
          action.payload !== 'All'
            ? action.payload
            : undefined,
      });
    }),
    tap(() => dispatch(setLoader({ key: 'best-prices', state: 'loaded' }))),
    tap((response) => dispatch(setBestPrices(response as RealEstateObject[]))),
    ignoreElements(),
  );
