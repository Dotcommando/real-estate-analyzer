import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { SearchParam } from '../../../constants/search-param.constant';
import { getSearchParam } from '../../../utils/search-params.utils';
import { DistrictsResponse } from '../district.type';

export type DistrictStore = {
  data: DistrictsResponse[];
  selectedDistrict: string | null;
};

const initialState: DistrictStore = {
  data: [],
  selectedDistrict: getSearchParam(SearchParam.selectedDistrict) || 'All',
};

export const districtSlice = createSlice({
  name: 'district',
  initialState,
  reducers: {
    setDistrictData: (
      state: DistrictStore,
      action: PayloadAction<DistrictsResponse[]>,
    ) => {
      state.data = action.payload;
    },
    setSelectedDistrict: (
      state: DistrictStore,
      action: PayloadAction<string | null>,
    ) => {
      state.selectedDistrict = action.payload;
    },
  },
});

export const { setDistrictData, setSelectedDistrict } = districtSlice.actions;

export default districtSlice.reducer;
