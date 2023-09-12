import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../../types/store.types';

import { EstateObject } from './best-prices.type';

export const selectBestPrices = createSelector(
  (state: RootState) => state['best-prices'],
  (bestPrices) => bestPrices,
);

export const selectBestPricesSelectedCity = createSelector(
  selectBestPrices,
  ({ selectedCity }) => selectedCity,
);

export const selectBestPricesData = createSelector(
  [selectBestPrices, selectBestPricesSelectedCity],
  ({ data }, selectedCity) => {
    if (selectedCity === null) {
      return data;
    }

    return data.filter((estateObject: EstateObject) => {
      return estateObject.city === selectedCity;
    });
  },
);
