import { DefaultItem } from '@consta/uikit/Select';
import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../../../types/store.types';
import { selectBestPricesSelectedCity } from '../../best-prices/best-prices.selector';
import { DistrictsResponse } from '../district.type';

export const selectDistrictData = createSelector(
  (state: RootState) => state.district,
  ({ data }) => data,
);

export const selectSelectedDistrict = createSelector(
  (state: RootState) => state.district,
  ({ selectedDistrict }) => selectedDistrict,
);

export const selectDistrictCitiesAsOptions = createSelector(
  (state: RootState) => state.district,
  ({ data }): DefaultItem[] => {
    return data.map((district: DistrictsResponse) => {
      const option: DefaultItem = {
        id: district.city,
        label: district.city,
      };

      return option;
    });
  },
);

export const selectDistrictsAsOptionsBySelectedCity = createSelector(
  [selectDistrictData, selectBestPricesSelectedCity],
  (districtData, selectedCity): DefaultItem[] => {
    if (!districtData.length || !selectedCity || selectedCity === 'All') {
      return [];
    }

    const currentDistrictByCity = districtData.find(
      (district) => district.city === selectedCity,
    );

    if (!currentDistrictByCity) {
      return [];
    }

    return currentDistrictByCity.districts.map((districtName) => {
      const option: DefaultItem = {
        id: districtName,
        label: districtName,
      };

      return option;
    });
  },
);
