import React from 'react';
import { useTranslation } from 'react-i18next';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';

import { RealEstateAirCondition } from '../../../../../../../types/real-estate.type';

type Props = {
  airCondition: RealEstateAirCondition;
};

const RealEstateObjectCardAirConditionComponent = ({ airCondition }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex-default">
      <img
        alt={t('indicator.bedroom')}
        className="icon-m"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAzklEQVR4nO2RPQoCMRSEV2E9lF5FQcFSr+HPtQyWWlhYa7FeYotviUQI8uIadhMM5uvy5iUzTIoik/kVgBGwBx6EowK22ksKsCMeGylAZcRxwJYnryYk8Uko81YfXEIO8E9fUBOPWgpwjhjgJAVYGPEKDANUPwAuxmMuLZTA3Sws9YWezfWbGI/StTiT+rL0I6A8zhLTtrRr4OYIoICDx9lGv7kqkoW3en1mfQVQdr0+s/TBUavvvEsAJdXqO08PWqrsqn8T4GOVXfVMRtMAo1Znr939Z+cAAAAASUVORK5CYII="
      />
      <Text size="xs" as="span" className={cnMixSpace({ mL: 's' })}>
        {airCondition}
      </Text>
    </div>
  );
};

export default RealEstateObjectCardAirConditionComponent;
