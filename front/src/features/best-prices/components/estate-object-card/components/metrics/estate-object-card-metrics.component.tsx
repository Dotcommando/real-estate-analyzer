import React from 'react';
import { useTranslation } from 'react-i18next';
import block from 'bem-cn';

import { RealEstateObject } from '../../../../../../types/real-estate.type';

import './estate-object-card-metrics.scss';

const cn = block('estate-object-card-metrics');

type Props = {
  realEstateObject: RealEstateObject;
};

const RealEstateObjectCardMetricsComponent = ({ realEstateObject }: Props) => {
  const { t } = useTranslation();

  return (
    <div className={cn()}>
      <div className={cn('item')}>
        <div className={cn('realty-type-full')}>{realEstateObject.type}</div>

        <div className={cn('realty-type-short')}>
          {t('bestPrices.apartShort')}
        </div>
      </div>
      <div className={cn('item', { bedrooms: true })}>
        <span className={`${cn('item', { 'bedrooms-img': true })}`} />
        <span className={cn('item', { 'bedrooms-number': true })}>
          {realEstateObject.bedrooms}
        </span>
        <span className={cn('item', { 'bedrooms-unit': true })}>
          {t('indicator.bedroom')}
        </span>
      </div>
      <div className={cn('item', { bathrooms: true })}>
        <span className={`${cn('item', { 'bathrooms-img': true })}`} />
        <span className={cn('item', { 'bathrooms-number': true })}>
          {realEstateObject.bathrooms}
        </span>
        <span className={cn('item', { 'bathrooms-unit': true })}>
          {t('indicator.bathroom')}
        </span>
      </div>
      <div className={cn('item', { 'energy-efficiency': true })}>
        <span className={cn('item', { 'energy-efficiency-img': true })} />
        <span className={cn('item', { 'energy-efficiency-title': true })}>
          {t('bestPrices.energy')}
        </span>
        <span>{realEstateObject['energy-efficiency']}</span>
      </div>
    </div>
  );
};

export default RealEstateObjectCardMetricsComponent;
