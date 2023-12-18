import { IRealEstate } from './real-estate';

import { Condition, EnergyEfficiency, PoolType, StandardSet } from '../constants';


export interface ISaleProperty extends IRealEstate {
  condition: Condition;
  'energy-efficiency': EnergyEfficiency;
  included?: string[];
  'construction-year'?: string;
}

export interface ISaleNonCommercialProperty extends ISaleProperty {
  alarm: StandardSet;
  attic: StandardSet;
  balcony: StandardSet;
  elevator: StandardSet;
  fireplace: StandardSet;
  garden: StandardSet;
  playroom: StandardSet;
  pool: PoolType;
  storage: StandardSet;
}

export interface ISaleCommercialProperty extends ISaleNonCommercialProperty {
  parking: StandardSet;
}
