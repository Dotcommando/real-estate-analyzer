import React from 'react';
import { useTranslation } from 'react-i18next';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';

import { EnergyEfficiency } from '../../../../../../../types/real-estate.type';

type Props = {
  energyEfficiency: EnergyEfficiency;
};

const RealEstateObjectCardEnergyComponent = ({ energyEfficiency }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex-default">
      <img
        alt={t('bestPrices.energy')}
        className="icon-m"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABAUlEQVR4nO3WwSoFUQDH4ZOFKLYslTXyBvIKyiMoj0A8glLsFR7Bgizdm7JRXkCJndyVbMSn494yrhm6M51jc3/L2XxzavqfCWHYAGEUbbRCzrCl22NOdAbPPbidEz7x1UEudNX3NnKgk3jog1dywLt+NpcancdrH/qGsZToCC5LTnubDI1hXXlnIVWYRqcC3ksJHxu8ZjOKZbzXgK+bwjc10PiiS03hVg34sBH6W9ivQJ8wFVKF8wp4LRkaw10JehWHJqQK472pLBandDEZGsNCyWl3wj/cx/eYyAFvZ7+PYzgqoKchV7pfb+wFsznhTg/ezIYWZvQi/tB/PhgW/u4DJ0+nel9VHaQAAAAASUVORK5CYII="
      />
      <Text size="xs" as="span" className={cnMixSpace({ mL: 's' })}>
        {t('bestPrices.energy')} {energyEfficiency}
      </Text>
    </div>
  );
};

export default RealEstateObjectCardEnergyComponent;
