import React, { useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text, TextPropView } from '@consta/uikit/Text';
import { Tooltip } from '@consta/uikit/Tooltip';
import block from 'bem-cn';

import { RealEstateObject } from '../../../../../../types/real-estate.type';
import { selectNormalizedStatistic } from '../../../../../statistic/statistic.selector';

import './estate-object-card-price.component.scss';

const cn = block('estate-object-card-price');

const MODERATE_OFFSET = 200;

type Props = {
  realEstateObject: RealEstateObject;
};

const RealEstateObjectCardPriceComponent = ({ realEstateObject }: Props) => {
  /** Store */
  const normalizedStatistic = useSelector(selectNormalizedStatistic);

  /** Hooks */
  const { t } = useTranslation();
  const ref = useRef(null);

  /** State */
  const [isShowTooltip, setIsShowTooptip] = useState<boolean>(false);

  const currencyIcon = () => {
    switch (realEstateObject.currency) {
      default: {
        return (
          <img
            alt={t('bestPrices.currencyEur')}
            className={`icon-m ${cnMixSpace({ mR: 's' })}`}
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEm0lEQVR4nO2az29VRRTHr2mhFYzyKAjulGgQa1BWbkg00SBo+CE78McKhIVAU0xcga7VFQmJro3/AAQIGEHCL0FQicGCLWHBD4Pij2gsINWPOfQ7yfBy37135s5rG8M3uWnfm5lzzsydc853zrwsu4v/KYDpwArgA2AXcBb4Fbipx/4fUJv1WQ40sokAoBt4HdgH/EM4RoC9wGtA13hM4F5gM3DFM+oGsB/Yojczz1YcmKSnoe+sbStwQGMcLgP9tjhjNYmXgfOeAV8Ba4AHImRNA9YCJz15Q8CSdm+jjzyFp4BFCeUvBr7x5G9P/naA2TLc8BewAehIqmRUTwewCRj23vasVMIf0etGUefJJIKLdc4HzknnoNlQV+BMT+AJYEYya8t1N4DD0m0+ObuOT7jtdBSYmtzachumAl962yzcZzzHtu00vS2WVrOjx9sV22NCrHPsWj5hzgo8B7wAPGPbNdJnhmXT4pBk5/LEhkjju4A+4LucbP4v8DXwZkjkY1Sec/7yLQa87eWJjsjVM2UOv8vwz/TXeJfDsarbFugEvtW4vioO7mhHcLIDFgJ/eL5lxLAzJxr1e/3eD5C/RGMuFXIzkbfbESLSF9wi7CqLcsAc4ALwRICOe7xIurqoo7FYw5rAedjYTzX2e2BKxTHBNB5YJz17is4TI2KkQQQQeExjDc+GGheoqyE/u5Vrp+i1YX+E8G3OeVMZXATgC+lbltf4oRq3RAh2UWpTNgYA3msZKOSg+bMsJ5UO81Ia3ArAK9K3I6/xhxBjdNqzxPmjN5HzFZ8zdbgb0Ct9Z/Mar6mxp6Kwl4CPgUMad1WfqzwbYydhMBYunT9nzfAy7uQsAMA7Gvd5NkZglAIZbtSeiFiA8aWdGndan8ueN9o9kV/UWJX7OBYQik8STGSmZP2UwtlniGZYBcXwNzBX3xU99yeYSG+Rs7vwuzxQ6EPeai+oa2QVACuLwq9LiFsrSbtz7EWNfSubAAlxhRoPRAi2kBrFmmMAHJS+pa3ImCON0wIFL/C218KURrcgt4405vubCsqGtVkgLI9o7Jmq1Q4t3qOBetZLz+6iTq+q08kQ4RprEelPp8TO/hX6D+Ruj+KDlR2XDavKkpxVxQ0vtuxYTOZchf2cPk9q6jNFbOC3lvu8vLpzsfQaQudpNPOY4sPzXhRzxYfDKj4c8yY6oguf7oDiw2mNLedqeitDdc4XqhBu1mI0XwBdUvFvbqDMfu9Nd4VWK6woNj9mMk2TetwKfbGVdeBp4HpUdUf3E24FKlH7doBRXuVOoNtiBHSrcIwKyeNRxL4POC4bjkffM2o17HbWXSsE121rJr4j0j1U+8JHZ/JBb5s9lczaYp8YlE5j5Q+nEjzL22bDKijfUQpNpKdT0em6t50eTK2k2wsAqKCc5PZVGduSncsTtx27rXfvun31q+2nVMZsRPrBeo92uK2U7La4ytvpU3JzuCl6/a6oSa9umybr6VEuWak+B5uuGIwNbByvX0BYEWC1FZS92m8IbulkumpcJpAHKygbAbRTmyorA6qVuR/VXFOlfof6LE1xfr+LbILiPyGHTGxxinyCAAAAAElFTkSuQmCC"
          />
        );
      }
    }
  };

  const normalizedPrice = realEstateObject.price
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  const priceView = useMemo((): TextPropView => {
    if (!normalizedStatistic || !normalizedStatistic[realEstateObject.city]) {
      return 'primary';
    }

    const currentNormalized = normalizedStatistic[realEstateObject.city];
    const medianPrice = currentNormalized['median-price'];
    const higherMedian = medianPrice + MODERATE_OFFSET;

    if (
      realEstateObject.price > medianPrice &&
      realEstateObject.price <= higherMedian
    ) {
      return 'warning';
    }

    if (realEstateObject.price <= medianPrice) {
      return 'success';
    }

    return 'alert';
  }, [realEstateObject, normalizedStatistic]);

  return (
    <div className="flex-between">
      <div
        className={`${cn()} flex-default`}
        ref={ref}
        onMouseEnter={() => setIsShowTooptip(true)}
        onMouseLeave={() => setIsShowTooptip(false)}
      >
        {currencyIcon()}
        <Text weight="bold" size="xl" view={priceView}>
          {normalizedPrice}
        </Text>

        {normalizedStatistic && normalizedStatistic[realEstateObject.city] && (
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAABGElEQVR4nM2TTUoDQRCFe6Fxk3QlEXf+nEPU46jkFJ5BGZBIpsogMSEHEPEs/oHmDmb1STUIycw4zMKFb9N0T783r+pVh/DX6ConYsyisRBlGZVPUaZt46ieecGGKNdivIhx2r9hNwzZ9FVuOYvKqyiZ36vki5OVh52MdtV3PxfjMYlU2laei2QxWN1vj+hE5a1Ujhgztx0aICrnYtyvHxqLVHOxrIIDR2/Mvjd2/aKyDHNaTQTCJVtifJUc9JS9JgLdEQfR+Cg6mHpUTQRizkCMyXpdOceev3e5TqB/R4zGe2fMYak0UTLPuSiyShbjSZSruknMPGePKvVkTit1PWfgf07k3ybxBz4knrM3Kr0FX41Jpe1/gW9zt7onWvTH8gAAAABJRU5ErkJggg=="
            alt="question"
            className={cnMixSpace({ mL: '2xs' })}
          />
        )}
      </div>

      <a href={realEstateObject.url} target="_blank" rel="noreferrer">
        {t('bestPrices.open')}
      </a>

      {isShowTooltip &&
        normalizedStatistic &&
        normalizedStatistic[realEstateObject.city] && (
          <Tooltip anchorRef={ref} size="l">
            <div>
              <Text className={cnMixSpace({ mB: 's' })}>
                {t('bestPrices.price.title')}
              </Text>
              <Text className={cnMixSpace({ mB: 'xs' })}>
                {t('bestPrices.price.description')}
              </Text>

              <div className={cnMixSpace({ mB: 'xs' })}>
                <Text as="span" view="alert">
                  {t('bestPrices.price.redOne')}
                </Text>
                <Text as="span">{t('bestPrices.price.redOneDescription')}</Text>
              </div>
            </div>

            <div className={cnMixSpace({ mB: 'xs' })}>
              <Text as="span" view="warning">
                {t('bestPrices.price.orangeOne')}
              </Text>
              <Text as="span">
                {t('bestPrices.price.orangeOneDescription')}
              </Text>
            </div>

            <div className={cnMixSpace({ mB: 'm' })}>
              <Text as="span" view="success">
                {t('bestPrices.price.greenOne')}
              </Text>
              <Text as="span">{t('bestPrices.price.greenOneDescription')}</Text>
            </div>

            <div className={cnMixSpace({ mB: 'xs' })}>
              <Text as="span">
                <Trans
                  i18nKey="bestPrices.price.currentMeanPrice"
                  values={{
                    city: realEstateObject.city,
                    price:
                      normalizedStatistic[realEstateObject.city]['mean-price'],
                  }}
                />
              </Text>
            </div>

            <div className={cnMixSpace({ mB: 'xs' })}>
              <Text as="span">
                <Trans
                  i18nKey="bestPrices.price.currentMedianPrice"
                  values={{
                    city: realEstateObject.city,
                    price:
                      normalizedStatistic[realEstateObject.city][
                        'median-price'
                      ],
                  }}
                />
              </Text>
            </div>
          </Tooltip>
        )}
    </div>
  );
};

export default RealEstateObjectCardPriceComponent;
