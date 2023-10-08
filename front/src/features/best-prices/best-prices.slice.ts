import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { RealEstateObject } from '../../types/real-estate.type';
import { AdsEnum } from '../statistic/statistic.type';

export type BestPricesStore = {
  data: RealEstateObject[];
  selectedCity: string | null;
  adsType: AdsEnum;
};

const initialState: BestPricesStore = {
  data: [],
  selectedCity: 'All',
  adsType: AdsEnum.RentFlats,
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
  },
});

export const {
  initBestPrices,
  setBestPrices,
  setBestPricesSelectedCity,
  setBestPricesAdsType,
} = bestPricesSlice.actions;

export default bestPricesSlice.reducer;
