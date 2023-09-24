import React from 'react';
import { useTranslation } from 'react-i18next';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';

type Props = {
  city: string;
};

const RealEstateObjectCarCityComponent = ({ city }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <span className={cnMixSpace({ mR: 's' })}>
        <img
          alt={t('bestPrices.city')}
          className="icon-m"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5klEQVR4nO2TMQ7DMAhFf1VVqnKD7r3/hTL3CMx0iVQJ1SrYhFqYt/knDjybAEVRDMOdYDa4RCaDk97IfmSPY/061s8RkZDD4qQiamargawie8RoQeS/3ltaRM1sNRBRJKsIybzVS4lYmO3WEVEkqwjJvNWLSaSjkRKx4v4hVZEFRUjmrTrriOCTk+ZDziJq3EVGOU1Ey0kiJPNWn+4izvvJTcTjHxkQUbOOiBaD4GY5CBgPMr8IsowWsoj8ebRI5t2jVSLZRktLiSx7Ixh8zsz3wf2bZn+EyC2LyDWLyCVUpCgKfOMNdVdJa0753uEAAAAASUVORK5CYII="
        />
      </span>

      <Text size="s" as="span">
        {city}
      </Text>
    </>
  );
};

export default RealEstateObjectCarCityComponent;
