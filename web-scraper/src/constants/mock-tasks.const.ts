import { UrlTypes } from './url-types.const';

import { IUrlData } from '../types';


export const mockTasks: IUrlData[] = [
  {
    priority: 1,
    url: 'https://www.bazaraki.com/adv/4743488_2-bedroom-apartment-to-rent/',
    urlType: UrlTypes.Ad,
    collection: 'rentapartmentsflats',
    queueName: 'DEFAULT',
  },
  {
    priority: 10,
    url: 'https://www.bazaraki.com/real-estate-to-rent/apartments-flats/',
    urlType: UrlTypes.Index,
    collection: 'rentapartmentsflats',
    queueName: 'DEFAULT',
  },
  {
    priority: 10,
    url: 'https://www.bazaraki.com/real-estate-to-rent/houses/',
    urlType: UrlTypes.Index,
    collection: 'renthouses',
    queueName: 'ANOTHER_QUEUE',
  },
  {
    priority: 5,
    url: 'https://www.bazaraki.com/real-estate-to-rent/houses/?page=2',
    urlType: UrlTypes.Pagination,
    collection: 'renthouses',
  },
  {
    priority: 5,
    url: 'https://www.bazaraki.com/real-estate-to-rent/houses/?page=3',
    urlType: UrlTypes.Pagination,
    collection: 'renthouses',
  },
  {
    priority: 1,
    url: 'https://www.bazaraki.com/adv/4734899_2-bedroom-apartment-to-rent/',
    urlType: UrlTypes.Ad,
    collection: 'rentapartmentsflats',
  },
  {
    priority: 1,
    url: 'https://www.bazaraki.com/adv/4743091_5-bedroom-detached-house-for-sale/',
    urlType: UrlTypes.Ad,
    collection: 'salehouses',
  },
  {
    priority: 5,
    url: 'https://www.bazaraki.com/real-estate-to-rent/houses/?page=3',
    urlType: UrlTypes.Pagination,
    collection: 'renthouses',
  },
];
