import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import block from 'bem-cn';

import { RealEstateObject } from '../../../../../../types/real-estate.type';
import { getPercentColor } from '../../../../../../utils/percent.util';
import { selectNormalizedStatistic } from '../../../../../statistic/statistic.selector';

import './estate-object-card-price.component.scss';

const cn = block('estate-object-card-price');

type Props = {
  realEstateObject: RealEstateObject;
};

const RealEstateObjectCardPriceComponent = ({ realEstateObject }: Props) => {
  /** Store */
  const normalizedStatistic = useSelector(selectNormalizedStatistic);

  const normalizedPrice = realEstateObject.price
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  const pricePerSqm = realEstateObject['property-area']
    ? (realEstateObject.price / realEstateObject['property-area']).toFixed(2)
    : 0;

  const indicatorClass = useMemo(() => {
    if (!realEstateObject.district) {
      return 'primary';
    }

    const combinedCityAndDistrict = `${realEstateObject.city}_${realEstateObject.district}`;
    const currentNormalized = normalizedStatistic[combinedCityAndDistrict];

    if (!normalizedStatistic || !currentNormalized) {
      return 'primary';
    }

    const medianPrice = currentNormalized['median-price'];

    return getPercentColor(medianPrice, realEstateObject.price);
  }, [realEstateObject, normalizedStatistic]);

  return (
    <div className={cn()}>
      {realEstateObject['property-area'] > 0 && (
        <div className={cn('area')}>
          <span className={cn('area-value')}>
            {realEstateObject['property-area']}
          </span>
          <span className={cn('area-delimiter')}> </span>
          <span className={cn('area-unit')}>
            {realEstateObject['property-area-unit']}
          </span>
        </div>
      )}
      <div className={`${cn('price-abs')} ${indicatorClass}`}>
        <span className={`${cn('price-abs-value')}`}>{normalizedPrice}</span>
        <span className={cn('price-abs-delimiter')}> </span>
        <span className={cn('price-abs-unit')}>€</span>
      </div>
      {realEstateObject['property-area'] > 0 && (
        <div className={`${cn('price-sqm')}  ${indicatorClass}`}>
          <span className={`${cn('price-sqm-value')}`}>{pricePerSqm}</span>
          <span className={cn('price-sqm-delimiter')}> </span>
          <span className={cn('price-sqm-unit')}>€/m&sup2;</span>
        </div>
      )}
    </div>
  );
};

export default RealEstateObjectCardPriceComponent;
