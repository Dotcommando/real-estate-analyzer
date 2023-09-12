import React from 'react';
import { useTranslation } from 'react-i18next';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';
import { block } from 'bem-cn';

import './registration.scss';

const cn = block('registration');

const RegistrationComponent = () => {
  const { t } = useTranslation();

  return (
    <div className={`${cn()} ${cnMixSpace({ mT: 'm' })}`}>
      <Text size="l" className={cnMixSpace({ mB: 'm' })}>
        {t('registration.title')}
      </Text>
    </div>
  );
};

export default RegistrationComponent;
