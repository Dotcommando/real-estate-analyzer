import { IRealEstate } from './real-estate';

import { Condition, EnergyEfficiency, PoolType, StandardSet } from '../constants';


export interface IRentProperty extends IRealEstate {
  condition: Condition;
  'energy-efficiency': EnergyEfficiency;
  included?: string[];
  'construction-year'?: string;
}

export interface IRentNonCommercialProperty extends IRentProperty {
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

export interface IRentCommercialProperty extends IRentNonCommercialProperty {
  parking: StandardSet;
}
