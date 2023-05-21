import { IRealEstate } from './real-estate';


export interface ISaleProperty extends IRealEstate {
  condition: 'Brand new' | 'Resale' | 'Under construction';
  'square-meter-price': number;
  'registration-number'?: number;
  'registration-block'?: number;
}
