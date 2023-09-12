import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { StatisticResponse } from './statistic.type';

export type StatisticStore = {
  data: StatisticResponse[];
};

const initialState: StatisticStore = {
  data: [],
};

export const statisticSlice = createSlice({
  name: 'statistic',
  initialState,
  reducers: {
    initStatistic: () => {},
    setStatistic: (
      state: StatisticStore,
      action: PayloadAction<StatisticResponse[]>,
    ) => {
      state.data = action.payload;
    },
  },
});

export const { initStatistic, setStatistic } = statisticSlice.actions;

export default statisticSlice.reducer;
