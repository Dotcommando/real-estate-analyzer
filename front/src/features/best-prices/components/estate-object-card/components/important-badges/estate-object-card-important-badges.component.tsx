import React from 'react';
import { cnMixSpace } from '@consta/uikit/MixSpace';

import { RealEstateObject } from '../../../../../../types/real-estate.type';

import RealEstateObjectCardBathroomsComponent from './bathroom/estate-object-card-bathroom.component';
import RealEstateObjectCardBedroomComponent from './bedroom/estate-object-card-bedroom.component';
import RealEstateObjectCardEnergyComponent from './energy/estate-object-card-energy.component';

type Props = {
  realEstateObject: RealEstateObject;
};

const RealEstateObjectCardImportantBadgesComponent = ({
  realEstateObject,
}: Props) => {
  return (
    <>
      <span className={cnMixSpace({ mR: 's' })}>
        <RealEstateObjectCardBedroomComponent
          bedrooms={realEstateObject.bedrooms}
        />
      </span>
      <span className={cnMixSpace({ mR: 's' })}>
        <RealEstateObjectCardBathroomsComponent
          bathrooms={realEstateObject.bathrooms}
        />
      </span>
      <span className={`${cnMixSpace({ mR: 's' })}} inline`}>
        <RealEstateObjectCardEnergyComponent
          energyEfficiency={realEstateObject['energy-efficiency']}
        />
      </span>
    </>
  );
};

export default RealEstateObjectCardImportantBadgesComponent;
