import { IPriceDeviations } from './price-deviations.interface';
import { IRentApartmentsFlats, IRentHouses } from './real-estate-to-rent';

import { Categories } from '../constants';


export interface IRentResidential extends Omit<IRentApartmentsFlats, 'type' | 'version' | 'expired'>, Omit<IRentHouses, 'type' | 'version' | 'expired'> {
  category: Categories;
  subcategory: string;
  activeDays: number;
  priceDeviations: IPriceDeviations;
}
