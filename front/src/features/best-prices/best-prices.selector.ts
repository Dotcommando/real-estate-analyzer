import { createSelector } from '@reduxjs/toolkit';

import { RealEstateObject } from '../../types/real-estate.type';
import { RootState } from '../../types/store.types';

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

    return data.filter((realEstateObject: RealEstateObject) => {
      return realEstateObject.city === selectedCity;
    });
  },
);
