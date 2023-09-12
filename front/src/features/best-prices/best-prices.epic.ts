import { filter, ignoreElements, of, switchMap, tap } from 'rxjs';

import { StoreEpic } from '../../types/store.types';
import { setLoader } from '../loader/loader.slice';

import { initBestPrices, setBestPrices } from './best-prices.slice';
import { EstateObject } from './best-prices.type';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const bestPricesEpic: StoreEpic = (action$, state$, { dispatch }) =>
  action$.pipe(
    filter(initBestPrices.match),
    tap(() => dispatch(setLoader({ key: 'best-prices', state: 'loading' }))),
    switchMap(() => {
      const estateObjects: EstateObject[] = [
        {
          id: '1',
          city: 'Limassol',
          district: 'District 1',
          bedrooms: 2,
          bathroom: 1,
          square: 87,
          price: 1650,
        },
        {
          id: '2',
          city: 'Limassol',
          district: 'District 2',
          bedrooms: 2,
          bathroom: 1,
          square: 87,
          price: 1650,
        },
        {
          id: '3',
          city: 'Limassol',
          district: 'District 3',
          bedrooms: 2,
          bathroom: 1,
          square: 87,
          price: 1650,
        },
        {
          id: '4',
          city: 'Limassol',
          district: 'District 4',
          bedrooms: 2,
          bathroom: 1,
          square: 87,
          price: 1650,
        },
        {
          id: '5',
          city: 'Limassol',
          district: 'District 5',
          bedrooms: 2,
          bathroom: 1,
          square: 87,
          price: 1650,
        },
        {
          id: '6',
          city: 'Nicosia',
          district: 'District 6',
          bedrooms: 2,
          bathroom: 1,
          square: 87,
          price: 1650,
        },
        {
          id: '7',
          city: 'Paphos',
          district: 'District 7',
          bedrooms: 2,
          bathroom: 1,
          square: 87,
          price: 1650,
        },
        {
          id: '8',
          city: 'Larnaca',
          district: 'District 8',
          bedrooms: 2,
          bathroom: 1,
          square: 87,
          price: 1650,
        },
        {
          id: '9',
          city: 'Famagusta',
          district: 'District 9',
          bedrooms: 2,
          bathroom: 1,
          square: 87,
          price: 1650,
        },
      ];

      return of(estateObjects);
    }),
    tap(() => dispatch(setLoader({ key: 'best-prices', state: 'loaded' }))),
    tap((response) => dispatch(setBestPrices(response as EstateObject[]))),
    ignoreElements(),
  );
