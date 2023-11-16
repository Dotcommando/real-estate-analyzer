import { IRealEstate } from './real-estate.interface';

import { Condition, EnergyEfficiency } from '../constants';


export interface IRentProperty extends IRealEstate {
  condition: Condition;
  'energy-efficiency': EnergyEfficiency;
  included?: string[];
  'construction-year'?: string;
}
