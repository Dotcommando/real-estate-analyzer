export type OnlineViewing = 'Yes' | 'No';

export interface ICoords {
  lat: number;
  lng: number;
  latTitle?: 'N' | 'S';
  lngTitle?: 'E' | 'W';
}

export type Condition = 'Brand new' | 'Resale' | 'Under construction';

export type EnergyEfficiency =
  | 'A+++'
  | 'A++'
  | 'A+'
  | 'A'
  | 'B+'
  | 'B'
  | 'C+'
  | 'C'
  | 'D+'
  | 'D'
  | 'E+'
  | 'E'
  | 'N/A'
  | 'In Progress';

export type RealEstateIncluded =
  | 'Alarm'
  | 'Fireplace'
  | 'Balcony'
  | 'Pool'
  | 'Elevator'
  | 'Storage room'
  | 'Garden';
export type RealEstateType = 'Apartment';
export type RealEstateParkingType = 'Covered' | 'Uncovered';
export type RealEstateFloor =
  | '1st'
  | '2nd'
  | '3rd'
  | '4th'
  | 'Ground floor'
  | '8th and above';
export type RealEstateFurnishing =
  | 'Fully Furnished'
  | 'Semi-Furnished'
  | 'Unfurnished'
  | 'Appliances οnly';
export type RealEstateAirCondition = 'Full, all rooms' | 'Partly' | 'No';
export type RealEstatePets = 'Not allowed' | 'Allowed';

export type RealEstateRentProperty = {
  'condition': Condition;
  'energy-efficiency': EnergyEfficiency;
  'included'?: RealEstateIncluded[];
  'construction-year'?: string;
  'type': RealEstateType;
};

export type RealEstateApartment = {
  'type': string;
  'floor'?: RealEstateFloor;
  'parking'?: RealEstateParkingType;
  'property-area': number;
  'property-area-unit': 'm²';
  'furnishing'?: RealEstateFurnishing;
  'bedrooms': number;
  'bathrooms': number;
  'air-conditioning': RealEstateAirCondition;
  'pets': RealEstatePets;
};

export type RealEstateObject = {
  'url': string;
  'title': string;
  'description': string;
  'publish_date': number;
  'city': string;
  'district'?: string;
  'price': number;
  'currency': string;
  'ad_id': string;
  'online-viewing'?: OnlineViewing;
  'postal-code': string;
  'reference-number'?: string;
  'registration-number'?: number;
  'registration-block'?: number;
  'square-meter-price': number;
  'coords'?: ICoords;
  'expired'?: boolean;
} & RealEstateRentProperty &
  RealEstateApartment;
