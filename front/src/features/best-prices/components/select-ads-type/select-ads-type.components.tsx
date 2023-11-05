import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { DefaultItem, Select } from '@consta/uikit/Select';

import { SearchParam } from '../../../../constants/search-param.constant';
import i18n from '../../../../i18n';
import { AdsEnum } from '../../../statistic/statistic.type';
import { selectBestPricesAdsType } from '../../best-prices.selector';
import { setBestPricesAdsType } from '../../best-prices.slice';

type Group = {
  label: string;
  id: string;
};

const groups: Group[] = [
  {
    id: 'rent',
    label: i18n.t('adsType.rent'),
  },
  {
    id: 'sale',
    label: i18n.t('adsType.sale'),
  },
];

const adsTypes: DefaultItem[] = [
  {
    label: i18n.t('adsType.rentFlats'),
    id: AdsEnum.RentFlats,
    groupId: 'rent',
  },
  {
    label: i18n.t('adsType.rentHouses'),
    id: AdsEnum.RentHouses,
    groupId: 'rent',
  },
  {
    label: i18n.t('adsType.saleFlats'),
    id: AdsEnum.SaleFlats,
    groupId: 'sale',
  },
  {
    label: i18n.t('adsType.saleHouses'),
    id: AdsEnum.SaleHouses,
    groupId: 'sale',
  },
];

const SelectAdsTypeComponent = () => {
  /** Hooks */
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();

  /** Store */
  const dispatch = useDispatch();
  const adsType = useSelector(selectBestPricesAdsType);

  const adsTypeValue = () => {
    return adsTypes.find((adType) => adType.id === adsType) || null;
  };

  return (
    <Select
      caption={t('adsType.type')}
      items={adsTypes}
      value={adsTypeValue()}
      onChange={({ value }) => {
        searchParams.set(SearchParam.adsType, value?.id as string);

        setSearchParams(searchParams);

        dispatch(
          setBestPricesAdsType((value?.id as AdsEnum) || AdsEnum.RentFlats),
        );
      }}
      size="s"
      style={{ width: '200px' }}
      groups={groups}
    />
  );
};

export default SelectAdsTypeComponent;
