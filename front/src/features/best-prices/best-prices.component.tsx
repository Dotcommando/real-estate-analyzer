import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChoiceGroup } from '@consta/uikit/ChoiceGroup';
import { Loader } from '@consta/uikit/Loader';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';
import { block } from 'bem-cn';

import i18n from '../../i18n';
import { RealEstateObject } from '../../types/real-estate.type';
import { selectLoaderBestPrices } from '../loader/loader.selector';

import RealEstateObjectCardComponent from './components/estate-object-card/estate-object-card.components';
import SelectAdsTypeComponent from './components/select-ads-type/select-ads-type.components';
import {
  selectBestPricesData,
  selectBestPricesSelectedCity,
} from './best-prices.selector';
import { initBestPrices, setBestPricesSelectedCity } from './best-prices.slice';

import './best-prices.scss';

const cn = block('best-prices');

type Item = string;

const items: Item[] = [
  'All',
  'Limassol',
  'Nicosia',
  'Paphos',
  'Larnaca',
  'Famagusta',
];

const BestPricesComponent = () => {
  /** Store */
  const dispatch = useDispatch();
  const loaderState = useSelector(selectLoaderBestPrices);
  const bestPricesData = useSelector(selectBestPricesData);
  const selectedCity = useSelector(selectBestPricesSelectedCity);

  useEffect(() => {
    dispatch(initBestPrices());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`${cn()} ${cnMixSpace({ mT: 'm' })}`}>
      {loaderState === 'loading' ? (
        <Loader />
      ) : (
        <>
          <Text size="xl" className={cnMixSpace({ mB: 'l' })}>
            {i18n.t('bestPrices.title')}
          </Text>

          <div className={`flex-default gap-s ${cnMixSpace({ mB: 'm' })}`}>
            <ChoiceGroup
              value={selectedCity}
              onChange={({ value }) =>
                dispatch(setBestPricesSelectedCity(value))
              }
              items={items}
              getItemLabel={(item) => item}
              multiple={false}
              name="CitySelector"
              size="s"
            />

            <SelectAdsTypeComponent />
          </div>

          <Text size="l" className={cnMixSpace({ mB: 'm' })}>
            {selectedCity || i18n.t('bestPrices.allCities')}
          </Text>

          <div className={cn('cards')}>
            {bestPricesData.map((realEstateObject: RealEstateObject) => (
              <RealEstateObjectCardComponent
                realEstateObject={realEstateObject}
                key={realEstateObject.url}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BestPricesComponent;
