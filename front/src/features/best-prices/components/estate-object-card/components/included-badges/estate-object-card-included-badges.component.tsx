import React from 'react';
import { cnMixSpace } from '@consta/uikit/MixSpace';

import { RealEstateObject } from '../../../../../../types/real-estate.type';

import RealEstateObjectCardAirConditionComponent from './airCondition/estate-object-card-air-condition.component';
import RealEstateObjectCardBalconyComponent from './balcony/estate-object-card-balcony.component';
import RealEstateObjectCardFireplaceComponent from './fireplace/estate-object-card-fireplace.component';
import RealEstateObjectCardFurnitureComponent from './furniture/estate-object-card-furniture.component';
import RealEstateObjectCardGardenComponent from './garden/estate-object-card-garden.component';
import RealEstateObjectCardPoolComponent from './pool/estate-object-card-pool.component';
import RealEstateObjectCardStorageRoomComponent from './storage-room/estate-object-card-storage-room.component';

type Props = {
  realEstateObject: RealEstateObject;
};

const RealEstateObjectCardIncludedBadgesComponent = ({
  realEstateObject,
}: Props) => {
  return (
    <>
      <div className="flex-default flex-wrap gap-s">
        <div>
          <RealEstateObjectCardAirConditionComponent
            airCondition={realEstateObject['air-conditioning']}
          />
        </div>
        {realEstateObject.furnishing && (
          <div>
            <RealEstateObjectCardFurnitureComponent
              furnishing={realEstateObject.furnishing}
            />
          </div>
        )}

        <RealEstateObjectCardFireplaceComponent
          realEstateObject={realEstateObject}
        />

        <RealEstateObjectCardBalconyComponent
          realEstateObject={realEstateObject}
        />

        <RealEstateObjectCardPoolComponent
          realEstateObject={realEstateObject}
        />

        <RealEstateObjectCardStorageRoomComponent
          realEstateObject={realEstateObject}
        />

        <RealEstateObjectCardGardenComponent
          realEstateObject={realEstateObject}
        />

        {/* <Text
          size="s"
          view="brand"
          onClick={() => setIsExpanded(!isExpanded)}
          className="c-pointer"
        >
          {isExpanded
            ? t('bestPrices.hideDetails')
            : t('bestPrices.expandDetails')}
        </Text> */}
      </div>
      <div className={`flex-default ${cnMixSpace({ mT: 's' })}`} />
    </>
  );
};

export default RealEstateObjectCardIncludedBadgesComponent;
