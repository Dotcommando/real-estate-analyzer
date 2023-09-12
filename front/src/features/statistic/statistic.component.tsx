import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DualAxes } from '@consta/charts/DualAxes';
import { Loader } from '@consta/uikit/Loader';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';
import { block } from 'bem-cn';

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

  useEffect(() => {
    dispatch(initStatistic());
  }, [dispatch]);

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

  // [
  //   { year: '1991', value: 3, count: 10 },
  //   { year: '1992', value: 4, count: 4 },
  //   { year: '1993', value: 3.5, count: 5 },
  //   { year: '1994', value: 5, count: 5 },
  //   { year: '1995', value: 4.9, count: 4.9 },
  //   { year: '1996', value: 6, count: 35 },
  //   { year: '1997', value: 7, count: 7 },
  //   { year: '1998', value: 9, count: 1 },
  //   { year: '1999', value: 13, count: 20 },
  // ];

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
