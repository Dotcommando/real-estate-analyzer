import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { RealEstateObject } from '../../types/real-estate.type';

export type BestPricesStore = {
  data: RealEstateObject[];
  selectedCity: string | null;
};

const initialState: BestPricesStore = {
  data: [],
  selectedCity: null,
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
    setBestPricesSelectedCity: (
      state: BestPricesStore,
      action: PayloadAction<BestPricesStore['selectedCity']>,
    ) => {
      state.selectedCity = action.payload;
    },
  },
});

export const { initBestPrices, setBestPrices, setBestPricesSelectedCity } =
  bestPricesSlice.actions;

export default bestPricesSlice.reducer;
