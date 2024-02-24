import { IRealEstate } from './real-estate.interface';

import { Condition, EnergyEfficiency, Parking, PoolType, StandardSet } from '../constants';


export interface IRentProperty extends IRealEstate {
  condition: Condition;
  'energy-efficiency': EnergyEfficiency;
  'construction-year'?: string;
  alarm: StandardSet;
  attic: StandardSet;
  balcony: StandardSet;
  elevator: StandardSet;
  fireplace: StandardSet;
  garden: StandardSet;
  playroom: StandardSet;
  pool: PoolType;
  storage: StandardSet;
  parking: Parking;
}
