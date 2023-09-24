import React from 'react';
import { useTranslation } from 'react-i18next';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';

import { RealEstateObject } from '../../../../../../types/real-estate.type';

type Props = {
  realEstateObject: RealEstateObject;
};

const RealEstateObjectCardPriceComponent = ({ realEstateObject }: Props) => {
  const { t } = useTranslation();

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

  return (
    <div className="flex-between">
      <div className="flex-default">
        {currencyIcon()}
        <Text weight="bold">{realEstateObject.price}</Text>
      </div>

      <a href={realEstateObject.url} target="_blank" rel="noreferrer">
        Open
      </a>
    </div>
  );
};

export default RealEstateObjectCardPriceComponent;
