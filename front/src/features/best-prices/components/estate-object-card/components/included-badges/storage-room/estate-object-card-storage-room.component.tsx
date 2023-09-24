import React from 'react';
import { useTranslation } from 'react-i18next';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';

import { RealEstateObject } from '../../../../../../../types/real-estate.type';

type Props = {
  realEstateObject: RealEstateObject;
};

const RealEstateObjectCardStorageRoomComponent = ({
  realEstateObject,
}: Props) => {
  const { t } = useTranslation();

  if (
    !realEstateObject.included?.find((include) => include === 'Storage room')
  ) {
    return null;
  }

  return (
    <div className="flex-default">
      <img
        alt={t('bestPrices.storageRoom')}
        className="icon-m"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nO2WUQrCMBBE9wj11HorRUG8Tw/wBImgS7Dapm7SzPsM6e7OzJbWTIj/QCNYd0KsUpCQ1hOpHetGyJOfH6i1DtEDOCSEaCcdSoRoJx1KhGgnHUqEaCcdSoQZTgI34DrlZO5eVb8o5If+6myNeR5ICErkI1otOn/ZL8B5qk7u3hrz1PFFdkgI0U46lAjRTjqUCNFOOpQI0U46lAhbS6Q2rHsh9p7SKRmzB4al65LZggE4pB7H3IbMTsSdjem4uIiXHrvUY5yaZ4mQecUie7M1ITlKDr16b0oWa6i3sELcAW4xSQ4gH1IZAAAAAElFTkSuQmCC"
      />
      <Text size="xs" as="span" className={cnMixSpace({ mL: 's' })}>
        {t('bestPrices.storageRoom')}
      </Text>
    </div>
  );
};

export default RealEstateObjectCardStorageRoomComponent;
