import React from 'react';
import { useTranslation } from 'react-i18next';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';

import { RealEstateObject } from '../../../../../../../types/real-estate.type';

type Props = {
  realEstateObject: RealEstateObject;
};

const RealEstateObjectCardPoolComponent = ({ realEstateObject }: Props) => {
  const { t } = useTranslation();

  if (!realEstateObject.included?.find((include) => include === 'Pool')) {
    return null;
  }

  return (
    <div className="flex-default">
      <img
        alt={t('bestPrices.pool')}
        className="icon-m"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACPUlEQVR4nO3Zu2sVQRTH8Y1JjBAVgwpGxMIipNHCRkHBxkqw8AX+ASIo2IgaUAttxNbOWqxsLCwtfCQGLCxEfKURLDT4QIIJGHx8ZM25uJprzDWbvZvrfrvd/c3M+e2cPTPsJEnFfwIW4xCe4TH2oi1ZKKALh/HSdO5jR1JmsAJn8CYT+EMcxBGMZu5fR39SJrAa5/AhE+gDHMimEroxgLHQfMUV9DbbwHpcwkTGwBB2/6XdKlzEZLSZiOvlxUU/FciGMPApAvmGG9jaYD99uBbtU97GjHXNX/RTA2+KVPiSSY3UwOY59rsFdzKz+vz3tMwFbIuAa29uMgz15TzOTjzKvcJhexioMR4ptS6XyOuP2RGl+1Vm3JvY2GhHi9KPNd5GjbH4GFfOl4E6cXT/c4XDHjzJGHiNk1hWSPT1Y1qDy/icyYrzWDpTo5r7FziKJUlJQH8sojVGY5HtrCfeFavw9IclwVThGc4YGk4WKmiLDWi6Eb3d7HgqKvIi1qdbUUJ/bDDz0BYKLpjO4Fy1hRJvt7ZHO4W1eWgLJ1IkZSBPbeHgYwTXm6e2cGpJnre2cFrWiFmQlJGWNTITKiMFUM1I2WjZj12rGJkJlZECaKUZGcLdBrSDeQfQibPx4y49ieqYhfYdTjdD+wvoSY8JcCJ+72d5iuPxvKcM2qQeuFenEqYdHcPILKpmM7RDf8rP8WhwFfvQHs/asT/uj4SuDNrBurNSUWb8rBjvG6ha6UlTVbVUVStDVbUqklz5DmfLlIgGMXTcAAAAAElFTkSuQmCC"
      />
      <Text size="xs" as="span" className={cnMixSpace({ mL: 's' })}>
        {t('bestPrices.pool')}
      </Text>
    </div>
  );
};

export default RealEstateObjectCardPoolComponent;
