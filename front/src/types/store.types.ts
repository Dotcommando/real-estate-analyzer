import { Dispatch } from 'react';
import { AnyAction } from '@reduxjs/toolkit';
import { Epic } from 'redux-observable';

import { BestPricesStore } from '../features/best-prices/best-prices.slice';
import { DistrictStore } from '../features/district/store/district.slice';
import { LoaderStore } from '../features/loader/loader.type';
import { StatisticStore } from '../features/statistic/statistic.slice';

export type RootState = {
  loader: LoaderStore;
  statistic: StatisticStore;
  ['best-prices']: BestPricesStore;
  district: DistrictStore;
};

export type StoreDependencies = {
  dispatch: Dispatch<AnyAction>;
};

export type StoreEpic = Epic<
  AnyAction,
  AnyAction,
  RootState,
  StoreDependencies
>;
