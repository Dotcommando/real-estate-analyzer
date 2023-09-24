import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@consta/uikit/Text';

import UiWithTooltipComponent from '../../../../../../../ui/with-tooltip/ui-with-tooltip.component';

import './estate-object-card-bedroom.component.scss';

type Props = {
  bedrooms: number;
};

const RealEstateObjectCardBedroomComponent = ({ bedrooms }: Props) => {
  const { t } = useTranslation();

  return (
    <UiWithTooltipComponent
      tooltipText={`${t('bestPrices.bedrooms')} ${bedrooms}`}
    >
      <img
        alt={t('indicator.bedroom')}
        className="icon-m"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAiUlEQVR4nO3SSw5EQBCA4Vo5xriuKw1WLMRBXGDY/0JIREi6h1KJ1L/tx5d+iHie95qAFmgs4DmH1WPJHAZSoAQGoAA++7mBdUAGJKHwhG7L/4TXslC43y38XYS7UHi63jtPTMwb58vJvxfeOA5+LKxh5RorGIfF/KpF+fPKwUANVIpwrbm/J2eNEd72onzQ5NkAAAAASUVORK5CYII="
      />
      <Text size="2xs" as="span" weight="bold" className="bedroom-icon">
        {bedrooms}
      </Text>
    </UiWithTooltipComponent>
  );
};

export default RealEstateObjectCardBedroomComponent;
