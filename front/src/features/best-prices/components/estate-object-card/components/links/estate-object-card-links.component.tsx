import React from 'react';
import { useTranslation } from 'react-i18next';
import block from 'bem-cn';

import { RealEstateObject } from '../../../../../../types/real-estate.type';

import './estate-object-card-links.scss';

const cn = block('estate-object-card-links');

type Props = {
  realEstateObject: RealEstateObject;
};

const RealEstateObjectCardLinksComponent = ({ realEstateObject }: Props) => {
  const { t } = useTranslation();

  return (
    <div className={cn()}>
      {/* <div className={cn('link')}>
        <a href="#">{t('bestPrices.links.hideAd')}</a>
      </div> */}
      {/* <div className={cn('link')}>
        <a href="#">{t('bestPrices.links.addToFavorites')}</a>
      </div> */}
      <div className={cn('link')}>
        <a href={realEstateObject.url} target="_blank" rel="noreferrer">
          {t('bestPrices.links.showSource')}
        </a>
      </div>
      {/* <div className={cn('link')}>
        <a href="#">{t('bestPrices.links.moreData')}</a>
      </div> */}
    </div>
  );
};

export default RealEstateObjectCardLinksComponent;
