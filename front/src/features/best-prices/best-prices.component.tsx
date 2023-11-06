import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Loader } from '@consta/uikit/Loader';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Pagination } from '@consta/uikit/Pagination';
import { Text } from '@consta/uikit/Text';
import { block } from 'bem-cn';

import { SearchParam } from '../../constants/search-param.constant';
import i18n from '../../i18n';
import { RealEstateObject } from '../../types/real-estate.type';
import { selectLoaderBestPrices } from '../loader/loader.selector';

import RealEstateObjectCardComponent from './components/estate-object-card/estate-object-card.components';
import SelectAdsTypeComponent from './components/select-ads-type/select-ads-type.components';
import SelectCityComponent from './components/select-city/select-city.components';
import SelectDistrictComponent from './components/select-district/select-district.components';
import { ADS_PER_PAGE } from './constants/ads.constant';
import {
  selectBestPricesData,
  selectBestPricesPage,
  selectBestPricesTotalAds,
} from './best-prices.selector';
import { initBestPrices, setBestPricesPage } from './best-prices.slice';

import './best-prices.scss';

const cn = block('best-prices');

const BestPricesComponent = () => {
  /** Store */
  const dispatch = useDispatch();
  const loaderState = useSelector(selectLoaderBestPrices);
  const bestPricesData = useSelector(selectBestPricesData);
  const totalAds = useSelector(selectBestPricesTotalAds);
  const page = useSelector(selectBestPricesPage);

  /** Hooks */
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(initBestPrices());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChangePage(changedPage: number): void {
    searchParams.set(SearchParam.page, changedPage.toString());

    setSearchParams(searchParams);

    dispatch(setBestPricesPage(changedPage));
  }

  return (
    <div className={`${cn()} ${cnMixSpace({ mT: 'm' })}`}>
      {loaderState === 'loading' ? (
        <Loader />
      ) : (
        <div className={cnMixSpace({ pB: 'l' })}>
          <Text size="xl" className={cnMixSpace({ mB: 'l' })}>
            {i18n.t('bestPrices.title')}
          </Text>

          <div className={`flex-default gap-s ${cnMixSpace({ mB: 'm' })}`}>
            <SelectCityComponent />

            <SelectDistrictComponent />

            <SelectAdsTypeComponent />
          </div>

          <div className={cn('cards')}>
            {bestPricesData.length > 0 ? (
              bestPricesData.map((realEstateObject: RealEstateObject) => (
                <RealEstateObjectCardComponent
                  realEstateObject={realEstateObject}
                  key={realEstateObject.url}
                />
              ))
            ) : (
              <Text size="xl">{t('common.notFound')}</Text>
            )}
          </div>

          {totalAds > ADS_PER_PAGE && (
            <Pagination
              currentPage={page - 1}
              totalPages={Math.round(totalAds / ADS_PER_PAGE)}
              onChange={(changedPage) => handleChangePage(changedPage + 1)}
              className={cnMixSpace({ mV: 'm' })}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default BestPricesComponent;
