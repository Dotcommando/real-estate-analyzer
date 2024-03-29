import {
  AirConditioning,
  Categories,
  Condition,
  EnergyEfficiency,
  Furnishing,
  OnlineViewing,
  Parking,
  PoolType,
  Source,
  StandardSet,
} from '../constants';


export interface ISaleLimits {
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
    priceSqmRange: {
      min: number;
      max: number;
    };
    propertyAreaRange: {
      min: number;
      max: number;
    };
  };
}
