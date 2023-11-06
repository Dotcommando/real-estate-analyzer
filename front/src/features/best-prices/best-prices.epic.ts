import { ignoreElements, switchMap, tap } from 'rxjs';

import { ofAction } from '../../operators/of-action.operator';
import { StoreEpic } from '../../types/store.types';
import { dateInHumanReadableFormat } from '../../utils/date-in-human-readable-format';
import { adsApi } from '../ads/api/ads.api';
import { AdsQueryParams } from '../ads/types/ads.types';
import { CountryEnum } from '../country/country.enum';
import { districtApi } from '../district/api/district.api';
import { selectSelectedDistrict } from '../district/store/district.selector';
import {
  setDistrictData,
  setSelectedDistrict,
} from '../district/store/district.slice';
import { setLoader } from '../loader/loader.slice';
import { initStatistic } from '../statistic/statistic.slice';
import { AnalysisType } from '../statistic/statistic.type';

import { ADS_PER_PAGE } from './constants/ads.constant';
import {
  selectBestPricesAdsType,
  selectBestPricesPage,
  selectBestPricesSelectedCity,
} from './best-prices.selector';
import {
  initBestPrices,
  setBestPrices,
  setBestPricesAdsType,
  setBestPricesPage,
  setBestPricesSelectedCity,
  setTotalAds,
} from './best-prices.slice';

export const bestPricesEpic: StoreEpic = (action$, state$, { dispatch }) =>
  action$.pipe(
    ofAction([
      initBestPrices,
      setBestPricesSelectedCity,
      setBestPricesAdsType,
      setBestPricesPage,
      setSelectedDistrict,
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
          analysisType: AnalysisType.DISTRICT_AVG_MEAN,
        }),
      );

      const selectedCity = selectBestPricesSelectedCity(state$.value);
      const selectedDistrict = selectSelectedDistrict(state$.value);

      const adsQueryParam: AdsQueryParams = {
        startDate: previousDay,
        ads: selectBestPricesAdsType(state$.value),
        limit: ADS_PER_PAGE,
        offset: currentPage !== 1 ? currentPage * ADS_PER_PAGE : 0,
        city: selectedCity && selectedCity !== 'All' ? selectedCity : undefined,
        district:
          selectedDistrict && selectedDistrict !== 'All'
            ? selectedDistrict
            : undefined,
      };

      return Promise.all([
        adsApi.getAds(adsQueryParam),
        districtApi.getDistricts({ country: CountryEnum.Cyprus }),
      ]);
    }),
    tap(() => {
      dispatch(
        setLoader({
          key: 'best-prices',
          state: 'loaded',
        }),
      );
    }),
    tap((response) => {
      dispatch(setBestPrices(response[0].ads));
      dispatch(setTotalAds(response[0].total));
      dispatch(setDistrictData(response[1]));
    }),
    ignoreElements(),
  );
