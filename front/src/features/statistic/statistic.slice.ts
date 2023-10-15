import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { StatisticGetParameters, StatisticResponse } from './statistic.type';

export type StatisticStore = {
  data: StatisticResponse[];
};

export type StatisticInitPayload = Pick<
  StatisticGetParameters,
  'startDate' | 'endDate'
>;

const initialState: StatisticStore = {
  data: [],
};

export const statisticSlice = createSlice({
  name: 'statistic',
  initialState,
  reducers: {
    initStatistic: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state: StatisticStore,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      action: PayloadAction<StatisticInitPayload>,
    ) => {},
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
