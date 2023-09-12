import { Dispatch } from 'react';
import {
  AnyAction,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import * as logger from 'redux-logger';
import { combineEpics, createEpicMiddleware } from 'redux-observable';

import { bestPricesEpic } from './features/best-prices/best-prices.epic';
import bestPricesReducer from './features/best-prices/best-prices.slice';
import loaderReducer from './features/loader/loader.slice';
import { statisticEpic } from './features/statistic/statistic.epic';
import statisticReducer from './features/statistic/statistic.slice';
import { RootState, StoreDependencies } from './types/store.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const epicMiddleware: any = createEpicMiddleware<
  AnyAction,
  AnyAction,
  RootState,
  StoreDependencies
>({
  dependencies: {
    get dispatch(): Dispatch<AnyAction> {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return store.dispatch;
    },
  },
});

export const store = configureStore({
  reducer: {
    'loader': loaderReducer,
    'statistic': statisticReducer,
    'best-prices': bestPricesReducer,
  },
  middleware: [
    ...getDefaultMiddleware({
      thunk: false, // or true if you want to use thunks
    }),
    epicMiddleware,
    process.env.NODE_ENV === 'development' ? logger.createLogger() : {},
  ],
});

epicMiddleware.run(combineEpics(statisticEpic, bestPricesEpic));

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
