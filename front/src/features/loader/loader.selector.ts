import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../../types/store.types';

export const selectLoader = createSelector(
  (state: RootState) => state.loader,
  (loader) => loader,
);

export const selectLoaderObjects = createSelector(
  (state: RootState) => state.loader,
  (loader) => loader.objects,
);

export const selectLoaderBestPrices = createSelector(
  (state: RootState) => state.loader,
  (loader) => loader['best-prices'],
);
