import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@consta/uikit/Card';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';
import { block } from 'bem-cn';

import { EstateObject } from '../../best-prices.type';

import './estate-object-card.scss';

const cn = block('estate-object-card');

type Props = {
  estateObject: EstateObject;
  selectedCity: string | null;
};

const EstateObjectCardComponent = ({ estateObject, selectedCity }: Props) => {
  const { t } = useTranslation();

  return (
    <Card
      className={cn()}
      verticalSpace="s"
      horizontalSpace="s"
      border
      form="round"
    >
      <Text size="l" weight="bold" className={cnMixSpace({ mB: 'm' })}>
        {selectedCity !== null ? selectedCity : ''} {estateObject.district}
      </Text>
      <Text size="m" className={cnMixSpace({ mB: 'xs' })}>
        {t('bestPrices.bathrooms')} {estateObject.bathroom}
      </Text>
      <Text size="m" className={cnMixSpace({ mB: 'xs' })}>
        {t('bestPrices.bedrooms')} {estateObject.bedrooms}
      </Text>
      <Text size="m" className={cnMixSpace({ mB: 'm' })}>
        {t('bestPrices.square')} {estateObject.square}
      </Text>
      <Text size="l" align="center">
        {estateObject.price}
      </Text>
    </Card>
  );
};

export default EstateObjectCardComponent;
