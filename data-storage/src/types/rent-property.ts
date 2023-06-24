import { IRealEstate } from './real-estate';

import { Condition, EnergyEfficiency } from '../constants';


export interface IRentProperty extends IRealEstate {
  condition: Condition;
  'energy-efficiency': EnergyEfficiency;
  included?: string[];
  'construction-year'?: string;
}
