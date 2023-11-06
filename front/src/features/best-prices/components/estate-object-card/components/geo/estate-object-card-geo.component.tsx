import React from 'react';
import block from 'bem-cn';

import { RealEstateObject } from '../../../../../../types/real-estate.type';

import './estate-object-card-geo.scss';

const cn = block('estate-object-card-geo');

type Props = {
  realEstateObject: RealEstateObject;
};

const RealEstateObjectCardGeoComponent = ({ realEstateObject }: Props) => {
  return (
    <div className={cn()}>
      <div className={`${cn('item', { 'country-short': true })}`}>CY</div>
      <div className={`${cn('item', { 'country-full': true })}`}>Cyprus</div>
      <div className={`${cn('item', { region: true })}`}>
        {realEstateObject.city}
      </div>
      <div className={`${cn('item', { city: true })}`}>
        {realEstateObject.city}
      </div>
      {realEstateObject.district && (
        <div className={`${cn('item', { 'district-raw': true })}`}>
          {realEstateObject.fullDistrict}
        </div>
      )}
      {/* TODO:  */}
      {realEstateObject.district && (
        <div className={`${cn('item', { 'district-processed': true })}`}>
          {realEstateObject.district}
        </div>
      )}
    </div>
  );
};

export default RealEstateObjectCardGeoComponent;
