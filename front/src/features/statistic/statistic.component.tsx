import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DualAxes } from '@consta/charts/DualAxes';
import { Loader } from '@consta/uikit/Loader';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';
import { block } from 'bem-cn';

import { dateInHumanReadableFormat } from '../../utils/date-in-human-readable-format';
import { selectLoaderObjects } from '../loader/loader.selector';

import { selectStatisticList } from './statistic.selector';
import { initStatistic } from './statistic.slice';
import { StatisticDataResponse } from './statistic.type';

import './statistic.scss';

const cn = block('statistic');

const defaultMeta = {
  date: {
    formatter: (value: string) => {
      return new Date(value).toLocaleDateString();
    },
  },
};

const StatisticComponent = () => {
  const dispatch = useDispatch();
  const loadingState = useSelector(selectLoaderObjects);
  const statisticList = useSelector(selectStatisticList);

  const date = new Date();

  date.setDate(date.getDate() - 90);

  const previous3Months = dateInHumanReadableFormat(date, 'YYYY-MM-DD');
  const currentDay = dateInHumanReadableFormat(new Date(), 'YYYY-MM-DD');

  useEffect(() => {
    dispatch(
      initStatistic({
        startDate: previous3Months,
        endDate: currentDay,
      }),
    );
  }, [currentDay, dispatch, previous3Months]);

  const getChartDataByCountry = (city: string) => {
    return statisticList.map((statistic) => {
      const currentDataByCity = statistic.data.find(
        (data: StatisticDataResponse) => data.city === city,
      );

      return {
        date: statistic.startDate,
        meanPrice: currentDataByCity?.['mean-price'],
        medianPrice: currentDataByCity?.['median-price'],
      };
    });
  };

  return (
    <div className={`${cn()} ${cnMixSpace({ mT: 'm' })}`}>
      <div className={cn('container')}>
        {loadingState === 'loading' ? (
          <Loader />
        ) : (
          <div className={cn('blocks')}>
            <div>
              <Text>Limassol</Text>
              <DualAxes
                data={[
                  getChartDataByCountry('Limassol'),
                  getChartDataByCountry('Limassol'),
                ]}
                xField="date"
                yField={['meanPrice', 'medianPrice']}
                meta={defaultMeta}
              />
            </div>
            <div>
              <Text>Nicosia</Text>
              <DualAxes
                data={[
                  getChartDataByCountry('Nicosia'),
                  getChartDataByCountry('Nicosia'),
                ]}
                xField="date"
                yField={['meanPrice', 'medianPrice']}
                meta={defaultMeta}
              />
            </div>
            <div>
              <Text>Paphos</Text>
              <DualAxes
                data={[
                  getChartDataByCountry('Paphos'),
                  getChartDataByCountry('Paphos'),
                ]}
                xField="date"
                yField={['meanPrice', 'medianPrice']}
                meta={defaultMeta}
              />
            </div>
            <div>
              <Text>Larnaca</Text>
              <DualAxes
                data={[
                  getChartDataByCountry('Larnaca'),
                  getChartDataByCountry('Larnaca'),
                ]}
                xField="date"
                yField={['meanPrice', 'medianPrice']}
                meta={defaultMeta}
              />
            </div>
            <div>
              <Text>Famagusta</Text>
              <DualAxes
                data={[
                  getChartDataByCountry('Famagusta'),
                  getChartDataByCountry('Famagusta'),
                ]}
                xField="date"
                yField={['meanPrice', 'medianPrice']}
                meta={defaultMeta}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticComponent;
