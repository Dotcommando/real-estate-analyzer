import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../../types/store.types';

export const selectBestPrices = createSelector(
  (state: RootState) => state['best-prices'],
  (bestPrices) => bestPrices,
);

export const selectBestPricesSelectedCity = createSelector(
  selectBestPrices,
  ({ selectedCity }) => selectedCity,
);

export const selectBestPricesAdsType = createSelector(
  selectBestPrices,
  ({ adsType }) => adsType,
);

export const selectBestPricesPage = createSelector(
  selectBestPrices,
  ({ page }) => page,
);

export const selectBestPricesData = createSelector(
  [selectBestPrices],
  (bestPrices) => {
    return bestPrices.data;
  },
);

export const selectBestPricesTotalAds = createSelector(
  [selectBestPrices],
  (bestPrices) => {
    return bestPrices.totalAds;
  },
);
