import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { EstateObject } from './best-prices.type';

export type BestPricesStore = {
  data: EstateObject[];
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
      action: PayloadAction<EstateObject[]>,
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
