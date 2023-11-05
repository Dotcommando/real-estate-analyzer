import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { block } from 'bem-cn';

import { RealEstateObject } from '../../../../types/real-estate.type';
import UiBookmark from '../../../../ui/bookmark/ui-bookmark.component.component';
import {
  getPercentColor,
  getPriceDifference,
} from '../../../../utils/percent.util';
import { selectNormalizedStatistic } from '../../../statistic/statistic.selector';

import RealEstateObjectCardGeoComponent from './components/geo/estate-object-card-geo.component';
import RealEstateObjectCardIncludesComponent from './components/includes/estate-object-card-includes.component';
import RealEstateObjectCardLinksComponent from './components/links/estate-object-card-links.component';
import RealEstateObjectCardMetricsComponent from './components/metrics/estate-object-card-metrics.component';
import RealEstateObjectCardPriceComponent from './components/price/estate-object-card-price.component';

import './estate-object-card.scss';

const cn = block('estate-object-card');

type Props = {
  realEstateObject: RealEstateObject;
};

const RealEstateObjectCardComponent = ({ realEstateObject }: Props) => {
  /** Store */
  const normalizedStatistic = useSelector(selectNormalizedStatistic);

  const bookmarkInfo = useMemo(() => {
    if (!realEstateObject.district) {
      return null;
    }

    const combinedCityAndDistrict = `${realEstateObject.city}_${realEstateObject.district}`;
    const currentNormalized = normalizedStatistic[combinedCityAndDistrict];

    if (!normalizedStatistic || !currentNormalized) {
      return null;
    }

    const medianColor = getPercentColor(
      currentNormalized['median-price'],
      realEstateObject.price,
    ).replace('color-', '');
    const medianPriceDifference = getPriceDifference(
      currentNormalized['median-price'],
      realEstateObject.price,
    );

    const averageColor = getPercentColor(
      currentNormalized['mean-price'],
      realEstateObject.price,
    ).replace('color-', '');
    const averagePriceDifference = getPriceDifference(
      currentNormalized['mean-price'],
      realEstateObject.price,
    );

    return {
      avg: {
        color: averageColor,
        value: medianPriceDifference,
      },
      median: {
        color: medianColor,
        value: averagePriceDifference,
      },
    };
  }, [realEstateObject, normalizedStatistic]);

  return (
    <div className={cn()}>
      <div className="card__title">
        <h4>{realEstateObject.title}</h4>
      </div>

      <RealEstateObjectCardGeoComponent realEstateObject={realEstateObject} />
      <RealEstateObjectCardMetricsComponent
        realEstateObject={realEstateObject}
      />

      <RealEstateObjectCardPriceComponent realEstateObject={realEstateObject} />

      <UiBookmark
        type="avg"
        value={bookmarkInfo?.avg?.value}
        color={bookmarkInfo?.avg?.color}
      />
      <UiBookmark
        type="median"
        value={bookmarkInfo?.median?.value}
        color={bookmarkInfo?.median?.color}
      />

      <RealEstateObjectCardIncludesComponent
        realEstateObject={realEstateObject}
      />

      <RealEstateObjectCardLinksComponent realEstateObject={realEstateObject} />
    </div>
  );
};

export default RealEstateObjectCardComponent;
