import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { LoaderActionPayload, LoaderStore } from './loader.type';

const initialState: LoaderStore = {
  'objects': 'idle',
  'best-prices': 'idle',
};

export const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    setLoader: (
      store: LoaderStore,
      action: PayloadAction<LoaderActionPayload>,
    ) => {
      const { key, state } = action.payload;

      store[key] = state;
    },
  },
});

export const { setLoader } = loaderSlice.actions;

export default loaderSlice.reducer;
