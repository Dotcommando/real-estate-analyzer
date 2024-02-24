import {
  AirConditioning,
  Categories,
  Condition,
  EnergyEfficiency,
  Furnishing,
  OnlineViewing,
  Parking,
  Pets,
  PoolType,
  Source,
  StandardSet,
} from '../constants';


export interface IRentLimits {
  limits: {
    source: Source[];
    'energy-efficiency': EnergyEfficiency[];
    'online-viewing': OnlineViewing[];
    'postal-code': string[];
    condition: Condition;
    'construction-year': string[];
    floor: string[];
    parking: Parking[];
    'parking-places': number;
    furnishing: Furnishing[];
    bedrooms: number[];
    bathrooms: number[];
    'air-conditioning': AirConditioning[];
    pets: Pets[];
    alarm: StandardSet[];
    attic: StandardSet[];
    balcony: StandardSet[];
    elevator: StandardSet[];
    fireplace: StandardSet[];
    garden: StandardSet[];
    playroom: StandardSet[];
    pool: PoolType[];
    storage: StandardSet[];
  };
  cities: {
    city: string;
    districts: string[];
  }[];
  categories: {
    category: Categories;
    subcategories: string[];
  }[];
  ranges: {
    priceRange: {
      min: number;
      max: number;
    };
    propertyAreaRange: {
      min: number;
      max: number;
    };
    plotAreaRange: {
      min: number;
      max: number;
    };
  };
}
