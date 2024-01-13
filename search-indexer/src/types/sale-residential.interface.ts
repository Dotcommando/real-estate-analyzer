import { IPriceDeviations } from './price-deviations.interface';
import { ISaleApartmentsFlats, ISaleHouses } from './real-estate-for-sale';

import { Categories } from '../constants';


export interface ISaleResidential extends Omit<ISaleApartmentsFlats, 'type' | 'version' | 'expired'>, Omit<ISaleHouses, 'type' | 'version' | 'expired'> {
  'price-sqm': number;
  category: Categories;
  subcategory: string;
  activeDays: number;
  priceDeviations: IPriceDeviations;
}
