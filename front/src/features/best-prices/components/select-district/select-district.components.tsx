import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Select } from '@consta/uikit/Select';

import { SearchParam } from '../../../../constants/search-param.constant';
import {
  selectDistrictsAsOptionsBySelectedCity,
  selectSelectedDistrict,
} from '../../../district/store/district.selector';
import { setSelectedDistrict } from '../../../district/store/district.slice';
import { selectBestPricesSelectedCity } from '../../best-prices.selector';

const SelectDistrictComponent = () => {
  /** Hooks */
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  /** Store */
  const dispatch = useDispatch();
  const districtOptions = useSelector(selectDistrictsAsOptionsBySelectedCity);
  const selectedCity = useSelector(selectBestPricesSelectedCity);
  const selectedDistrict = useSelector(selectSelectedDistrict);

  if (!districtOptions.length || !selectedCity || selectedCity === 'All') {
    return null;
  }

  return (
    <Select
      caption={t('bestPrices.district')}
      items={districtOptions}
      value={
        selectedDistrict
          ? { id: selectedDistrict, label: selectedDistrict }
          : null
      }
      onChange={({ value }) => {
        if (value) {
          searchParams.set(SearchParam.selectedDistrict, value.label);

          setSearchParams(searchParams);

          dispatch(setSelectedDistrict(value.label));
        }
      }}
      size="s"
      style={{ width: '200px' }}
    />
  );
};

export default SelectDistrictComponent;
