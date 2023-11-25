import { IRentApartmentsFlats } from './rent-apartments-flats.interface';
import { IRentHouses } from './rent-houses.interface';
import { ISaleApartmentsFlats } from './sale-apartments-flats.interface';
import { ISaleHouses } from './sale-houses.interface';


export type IAdsResult = (IRentHouses | ISaleHouses | ISaleApartmentsFlats | IRentApartmentsFlats)[];