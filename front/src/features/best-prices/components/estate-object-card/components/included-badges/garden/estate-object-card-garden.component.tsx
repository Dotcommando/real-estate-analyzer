import React from 'react';
import { useTranslation } from 'react-i18next';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';

import { RealEstateObject } from '../../../../../../../types/real-estate.type';

type Props = {
  realEstateObject: RealEstateObject;
};

const RealEstateObjectCardGardenComponent = ({ realEstateObject }: Props) => {
  const { t } = useTranslation();

  if (!realEstateObject.included?.find((include) => include === 'Garden')) {
    return null;
  }

  return (
    <div className="flex-default">
      <img
        alt={t('bestPrices.garden')}
        className="icon-m"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADZElEQVR4nO2ZW4hNURjHt0vGaIhJhDERoyZeKFIePPCkXMKDRI00ycs8KGUmxYtHYh48uDzMC2pMkVtGpFGEcUkikXhxJ/dx/+nLf01r9uxzMfY5+5ycf+3OXt/61vet/1lrfWutbwdBCSWU8H8BGAU0Ah3AS+Ab8Bg4A9QDw4JiAPCB9HgKLAwKHcAv4CiwCBgNDAImACuA8yJjOnVBIQNYkqF+PfBTU247sNjIBsUIYHNout0H5gXFCGAusBG4KTJfgBlBsQLoD+wTmWNBMQOoEpG3GfQseJwG2u09KEQAXSITufCBWuCht67svTYoNAC31MEtKdbTG9Vf0oNkc6UTiSABIlOBz8AP/58GVioQGNqAcj1tXpBYWTBEDMBO+W9WuUmbp2GHBYZQkNjhbbA9Ok7CRGbJ/z1gj95thBrStGmQjsPAQiAyMNSpT5lOCmq3RLqGU8DQpImM8zr03EboL0fT2hhuJLnYp+m4744sNX2wMRG4m9hiB+bbZijfdo+p/AdblbLhMD/e3qZ2vEYnYcNBoCwGm2WyhWzn7soA9AO2eqFzlx9eY7SPZ79fXPadE7tstXS7gHWxOvBgtj0/LbHdfRQaLUR2IxbD6X36OAsMj8PoVRl84izH0tv0Pgn5vBKH0U7gOlDtrMfS2/Q+HarluzMnDmI1moQfSkSKcETIEv/qp6iIAK/0WLJjRF87PR3YoAxk1neGTDpZ1Jen4G4n5PJMu/Yq7w4eBTuh1uWKCH+yMq3Ae+CdVE4CY/Ucl+yr7SnAgijD7gAYhd3hY3bcRETidcjFR5OH0koumeHQk4wOge5i8yGUoR8BDABWA0dyRMRGwnBMF7Ux9hvRbjAwBNgk/cthBUsKjFTlM8leqNzDYI6I2HTq5StN+wo3alGVU1T5QOVHKtfkgYibMmOzIDHAS6hfjFKY7VcC11SekwcieyU6numU6+XGbBRnRikslUKryjZfDcvzQMSuunckPpTB9n7pHUil4G5m21RuVrkp10QkuyJxfQbb46X3MpXCCSksU3mtyofzRKRL4oosifT+CqAYbRvNd5cN0TdENxcr80DkpsSNabL7Vd4f3hql0BE1P/V52nAu3ImE8RqYHEXEPsLcDoc/YJJ29XZPdiFBAu+0efYmUUIJJQSp8BtJwOeqEcb6qwAAAABJRU5ErkJggg=="
      />
      <Text size="xs" as="span" className={cnMixSpace({ mL: 's' })}>
        {t('bestPrices.garden')}
      </Text>
    </div>
  );
};

export default RealEstateObjectCardGardenComponent;
