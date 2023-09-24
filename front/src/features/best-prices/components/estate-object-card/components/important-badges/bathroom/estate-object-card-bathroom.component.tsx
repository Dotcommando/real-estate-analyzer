import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@consta/uikit/Text';

import UiWithTooltipComponent from '../../../../../../../ui/with-tooltip/ui-with-tooltip.component';

import './estate-object-card-bathroom.component.scss';

type Props = {
  bathrooms: number;
};

const RealEstateObjectCardBathroomsComponent = ({ bathrooms }: Props) => {
  const { t } = useTranslation();

  return (
    <UiWithTooltipComponent
      tooltipText={`${t('bestPrices.bathrooms')} ${bathrooms}`}
    >
      <img
        alt={t('indicator.bathroom')}
        className="icon-m"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB20lEQVR4nO2Zu0oDQRRAp/IFipVCFKJ+gR/i4zNEsFFQUAQb8T+0MBaC+gEqmFjEJhaKnSI2WqmJQho5MslEdLOzu1k25M6aAwv7nDuHe2dZ9iolHKAfWAKKwCvwYfZX9DXlAkAWuMbOLTChJAP0ASUz4TtgHhg025yR0Nzoe5VkgAFgGhj2uTb0S2ZZuQz1LGmKShrALHBuFrXezoAZy706K5qykgSwE7Cwty3P1FDCMhFGU2YaF5QUTDmFcerzXA0lBaASquGzFiSK5COIXIgXiQsSRYBLnZmgfVdE8o3yse07IRIHcSLe8iHkWLLIn/IJOxYrEhckifiVDdHPiRJpKhsinksf1NPlOoWfGnMdRYpECrhPvtNLtIsvQAY4wT2O9dy9MmO4R8aWGadQNnAM1RURhvoPGfnEHSpBIg+4w32QyBHucBgksog7LASJ6P7cG/J5100eq4iR2UI+m4ESRqQnpCXcaUp6jqEiRmYceEIej/rjNpKE52v4ClmZyLYk4Wnab0TsJrWLMrAO9MaS8GkDr5mBv4BqGydeNTE0q6FvpxZFRoEDM/huYgPb4+2ZWDlgpB29vWdgMpGBg2NOmVjJ/SUxIi/Avg6QyEyjy+RM7JT/71Up5BvfI6PpKi1w+AAAAABJRU5ErkJggg=="
      />
      <Text size="2xs" as="span" weight="bold" className="bathroom-icon">
        {bathrooms}
      </Text>
    </UiWithTooltipComponent>
  );
};

export default RealEstateObjectCardBathroomsComponent;
