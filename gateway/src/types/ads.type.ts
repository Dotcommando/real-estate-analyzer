import { ISaleApartmentsFlats, ISaleHouses } from './real-estate-for-sale';
import { IRentApartmentsFlats, IRentHouses } from './real-estate-to-rent';


export type IAdsResult = (IRentHouses | ISaleHouses | ISaleApartmentsFlats | IRentApartmentsFlats)[];
