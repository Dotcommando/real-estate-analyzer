import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../../types/store.types';

export const selectStatisticList = createSelector(
  (state: RootState) => state.statistic,
  (statistic) => statistic.data,
);
