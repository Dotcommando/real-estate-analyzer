export type EstateObjectDetailed = {
  name: string;
  description: string;
  coordinates: [number, number];
} & EstateObject;

export type EstateObject = {
  id: string;
  city: string;
  district: string;
  bedrooms: number;
  bathroom: number;
  square: number;
  price: number;
};
