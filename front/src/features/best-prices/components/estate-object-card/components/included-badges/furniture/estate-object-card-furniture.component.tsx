import React from 'react';
import { useTranslation } from 'react-i18next';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';

import { RealEstateFurnishing } from '../../../../../../../types/real-estate.type';

type Props = {
  furnishing: RealEstateFurnishing;
};

const RealEstateObjectCardFurnitureComponent = ({ furnishing }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex-default">
      <img
        alt={t('bestPrices.furniture')}
        className="icon-m"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADW0lEQVR4nO2Y72tPURzHzzY/ZrI1Fu3JEp6QMFEe8GTlD2CJTaSRFWqtKB7uiZSnS4jyjPIrKZkoDDFRJjO1KT+nbWRJ8msvfb59bo7r3u/3fu89363VfT+653Pu/Xze73PO55zPPcak+AvgLuOHTuMKjDOMayET6dtApEJMOiMZpEsrDGmOmDRHMkhzJAxpjpg0RzJIcyQMaY6YNEcySHNkQuYIMBloAq4BA8Bowj/S38B74CqwDZgURga4D9xLLARYDPRSWDwDFoUIySCREGAJMGIF2wJUA0W5HOcIWqR+xF+P+v8URIZsBKO8B0wF+rT/tLSTkM9CQOKc8YgUQsge7XsMTHHMP0jMkxAhncDtJEK8i7Z1jnmHEamPOvpBCPxW1/B33Z3KzBgAmK7xZEcrdiWk0ktAl2QjkPESvtKVkCq1D7kkGoHMkMatSiwEWAbcVPuoHoJrXJP2kVgL3LIOWom/NLYQPfy8c0NG56U+/wLWF0jEZs0LQT8wrM+f5ZCMK+SStk9IWaK2nWp7B5QWIMEH1f8Oqxw6qbaLcYV81PZs30sP7WC+vnJglcwYsB3YBxwE9gPNwAZZmsDMgG93q987PvsctQ/HFfJB2zW+lxrU3qNlS4uMli69fArIN8BlYC+wHHih9npfvLlqH4gr5Ji2r9izItUp8CqE3DfgEXBBl+Rh4ABwCDgOnAUeAF9Cvpe8KPHNhlTFgqNxhcwCutX2E6i1XpRRFLwFTgFbgYVeCR4hUDGwAGhUwa/VX4v1Tq3GFXQHLcdIQtRQBpxTe7tlrwA2Ja18fdXDRmCGZWvXuOfzrSj+E2Jtw94WOM0F8QhESq2TPa8zJFSIdnRpX4MrsjmIyJITdMX8PoOgDtk6BdddEI1A5IbGa3YtpBz4qtvrPBdks5CYr3EkXoVTIQLdXdDts07EGYfQwapT/05gQgJVj8HFg1OYLKNWYxV1cvi5xA/gqT6P5PMfQgwhbfpOh7blfkvw3D6R8yBQbN2cNKmtQ9tt+fqLDC0hBKu1VPFuVhoT+PRqt36tdsW3oC+uz5yw/g9WAK363BtnNiyfJTqjqM+V+jwY12dOSOEWsBT/qVaT3ppYOJLUr8kSUGovqWKlepUKeJdD3/I/IsWj+JbK28mNzR9/kXdKc3X6aQAAAABJRU5ErkJggg=="
      />
      <Text size="xs" as="span" className={cnMixSpace({ mL: 's' })}>
        {furnishing}
      </Text>
    </div>
  );
};

export default RealEstateObjectCardFurnitureComponent;
