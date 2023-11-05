import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Loader } from '@consta/uikit/Loader';
import { Select } from '@consta/uikit/Select';

import { SearchParam } from '../../../../constants/search-param.constant';
import { selectDistrictCitiesAsOptions } from '../../../district/store/district.selector';
import { setSelectedDistrict } from '../../../district/store/district.slice';
import { selectBestPricesSelectedCity } from '../../best-prices.selector';
import { setBestPricesSelectedCity } from '../../best-prices.slice';

const SelectCityComponent = () => {
  /** Hooks */
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();

  /** Store */
  const dispatch = useDispatch();
  const citiesOptions = useSelector(selectDistrictCitiesAsOptions);
  const selectedCity = useSelector(selectBestPricesSelectedCity);

  if (!citiesOptions.length) {
    return <Loader />;
  }

  return (
    <Select
      caption={t('bestPrices.city')}
      items={citiesOptions}
      value={selectedCity ? { id: selectedCity, label: selectedCity } : null}
      onChange={({ value }) => {
        if (value) {
          searchParams.set(SearchParam.selectedCity, value.label);
          searchParams.delete(SearchParam.selectedDistrict);

          setSearchParams(searchParams);

          dispatch(setBestPricesSelectedCity(value.label));
          dispatch(setSelectedDistrict('All'));
        }
      }}
      size="s"
      style={{ width: '200px' }}
    />
  );
};

export default SelectCityComponent;
