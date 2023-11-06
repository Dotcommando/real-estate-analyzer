import React from 'react';
import { useTranslation } from 'react-i18next';
import block from 'bem-cn';

import { RealEstateObject } from '../../../../../../types/real-estate.type';

import './estate-object-card-includes.component.scss';

const cn = block('estate-object-card-includes');

type Props = {
  realEstateObject: RealEstateObject;
};

const RealEstateObjectCardIncludesComponent = ({ realEstateObject }: Props) => {
  const { t } = useTranslation();

  const hasBalcony =
    realEstateObject.included?.find((include) => include === 'Balcony') !==
    undefined;
  const hasStorageRoom =
    realEstateObject.included?.find((include) => include === 'Storage room') !==
    undefined;
  const hasPool =
    realEstateObject.included?.find((include) => include === 'Pool') !==
    undefined;
  const hasFireplace =
    realEstateObject.included?.find((include) => include === 'Fireplace') !==
    undefined;
  const hasGarden =
    realEstateObject.included?.find((include) => include === 'Garden') !==
    undefined;

  return (
    <div className={cn()}>
      <div className="includes__air-conditioner">
        <span className={cn('img', { air: true })} />
        <span className={cn('details')}>
          {realEstateObject['air-conditioning']}
        </span>
      </div>
      {realEstateObject.furnishing && (
        <div className="includes__furniture">
          <span className={cn('img', { furniture: true })} />
          <span className={cn('details')}>{realEstateObject.furnishing}</span>
        </div>
      )}
      {hasBalcony && (
        <div className="includes__balcony">
          <span className={cn('img', { balcony: true })} />
          <span className={cn('details')}>{t('bestPrices.balcony')}</span>
        </div>
      )}
      {hasStorageRoom && (
        <div className="includes__storage">
          <span className={cn('img', { storage: true })} />
          <span className={cn('details')}>{t('bestPrices.storageRoom')}</span>
        </div>
      )}
      {hasPool && (
        <div className="includes__pool">
          <span className={cn('img', { pool: true })} />
          <span className={cn('details')}>{t('bestPrices.pool')}</span>
        </div>
      )}
      {hasFireplace && (
        <div className="includes__fireplace">
          <span className={cn('img', { fireplace: true })} />
          <span className={cn('details')}>{t('bestPrices.firePlace')}</span>
        </div>
      )}
      {hasGarden && (
        <div className="includes__garden">
          <span className={cn('img', { garden: true })} />
          <span className={cn('details')}>{t('bestPrices.garden')}</span>
        </div>
      )}
    </div>
  );
};

export default RealEstateObjectCardIncludesComponent;
