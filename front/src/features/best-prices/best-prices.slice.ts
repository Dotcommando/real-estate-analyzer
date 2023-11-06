import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { SearchParam } from '../../constants/search-param.constant';
import { RealEstateObject } from '../../types/real-estate.type';
import { getSearchParam } from '../../utils/search-params.utils';
import { AdsEnum } from '../statistic/statistic.type';

export type BestPricesStore = {
  data: RealEstateObject[];
  selectedCity: string | null;
  adsType: AdsEnum;
  page: number;
  totalAds: number;
};

/** TODO: to Ads */
const initialState: BestPricesStore = {
  data: [],
  selectedCity: getSearchParam(SearchParam.selectedCity) || 'All',
  adsType:
    (getSearchParam(SearchParam.adsType) as AdsEnum) || AdsEnum.RentFlats,
  page: parseInt(getSearchParam(SearchParam.page) || '1', 10),
  totalAds: 0,
};

export const bestPricesSlice = createSlice({
  name: 'best-prices',
  initialState,
  reducers: {
    initBestPrices: () => {},
    setBestPrices: (
      state: BestPricesStore,
      action: PayloadAction<RealEstateObject[]>,
    ) => {
      state.data = action.payload;
    },
    setBestPricesAdsType: (
      state: BestPricesStore,
      action: PayloadAction<AdsEnum>,
    ) => {
      state.adsType = action.payload;
    },
    setBestPricesSelectedCity: (
      state: BestPricesStore,
      action: PayloadAction<BestPricesStore['selectedCity']>,
    ) => {
      state.selectedCity = action.payload;
    },
    setBestPricesPage: (
      state: BestPricesStore,
      action: PayloadAction<BestPricesStore['page']>,
    ) => {
      state.page = action.payload;
    },
    setTotalAds: (
      state: BestPricesStore,
      action: PayloadAction<BestPricesStore['totalAds']>,
    ) => {
      state.totalAds = action.payload;
    },
  },
});

export const {
  initBestPrices,
  setBestPrices,
  setBestPricesSelectedCity,
  setBestPricesAdsType,
  setBestPricesPage,
  setTotalAds,
} = bestPricesSlice.actions;

export default bestPricesSlice.reducer;
