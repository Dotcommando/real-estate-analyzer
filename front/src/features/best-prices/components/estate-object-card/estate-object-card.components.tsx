import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Card } from '@consta/uikit/Card';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';
import { block } from 'bem-cn';

import { RealEstateObject } from '../../../../types/real-estate.type';
import { selectBestPricesSelectedCity } from '../../best-prices.selector';

import RealEstateObjectCardImportantBadgesComponent from './components/important-badges/estate-object-card-important-badges.component';
import RealEstateObjectCardIncludedBadgesComponent from './components/included-badges/estate-object-card-included-badges.component';
import RealEstateObjectCardPriceComponent from './components/price/estate-object-card-price.component';
import RealEstateObjectCarCityComponent from './components/top-badges/city/estate-object-card-city.component';

import './estate-object-card.scss';

const cn = block('estate-object-card');

type Props = {
  realEstateObject: RealEstateObject;
};

const MAXIMUM_COUNT_SYMBOLS = 300;

const RealEstateObjectCardComponent = ({ realEstateObject }: Props) => {
  /** Store */
  const selectedCity = useSelector(selectBestPricesSelectedCity);

  /** Hooks */
  const { t } = useTranslation();

  /** State */
  const [isExpanded, setIsExpanded] = useState(false);

  const description = () => {
    if (realEstateObject.description.length > MAXIMUM_COUNT_SYMBOLS) {
      return (
        <>
          {isExpanded
            ? realEstateObject.description
            : realEstateObject.description.slice(0, MAXIMUM_COUNT_SYMBOLS)}
          <Text
            size="s"
            view="link"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`${cnMixSpace({ mT: 's' })} c-pointer`}
          >
            {isExpanded
              ? t('bestPrices.hideDescription')
              : t('bestPrices.expandDescription')}
          </Text>
        </>
      );
    }

    return realEstateObject.description;
  };

  return (
    <Card
      className={cn()}
      verticalSpace="s"
      horizontalSpace="s"
      border
      form="round"
    >
      <div>
        <Text size="l" weight="bold" className={cnMixSpace({ mB: 's' })}>
          {realEstateObject.title}
        </Text>
        {!selectedCity && (
          <div className={`${cnMixSpace({ mB: 's' })} flex-default`}>
            <RealEstateObjectCarCityComponent city={realEstateObject.city} />
          </div>
        )}
        <div className={cnMixSpace({ mB: 's' })}>
          <RealEstateObjectCardImportantBadgesComponent
            realEstateObject={realEstateObject}
          />
        </div>

        <img src="/house.png" className={cn('image')} alt="house" />

        <Text
          size="s"
          className={`${cnMixSpace({ mB: 's' })} ${cn('description')}`}
        >
          {description()}
        </Text>
      </div>

      <div>
        <div className={`${cnMixSpace({ mB: 's' })} ${cn('badges')}`}>
          <RealEstateObjectCardIncludedBadgesComponent
            realEstateObject={realEstateObject}
          />
        </div>

        <RealEstateObjectCardPriceComponent
          realEstateObject={realEstateObject}
        />
      </div>
    </Card>
  );
};

export default RealEstateObjectCardComponent;
