import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';

import {
  AirConditioning,
  AirConditioningArray,
  ApartmentsFlatsType,
  ApartmentsFlatsTypeArray,
  Condition,
  ConditionArray,
  EnergyEfficiency,
  EnergyEfficiencyArray,
  Furnishing,
  FurnishingArray,
  ParkingArray, Pets,
  PetsArray,
} from '../constants';
import { IRentApartmentsFlats } from '../types/real-estate-to-rent';


export interface IRentApartmentsFlatsDoc extends IRentApartmentsFlats, Document {
}

export const RentApartmentsFlatsSchema = new Schema<IRentApartmentsFlatsDoc, Model<IRentApartmentsFlatsDoc>>(
  {
    url: {
      type: String,
      required: [ true, 'URL is required' ],
    },
    title: {
      type: String,
      required: [ true, 'Title is required' ],
    },
    description: String,
    publish_date: {
      type: Number,
      required: [ true, 'Publish date is required' ],
    },
    city: {
      type: String,
      required: [ true, 'City is required' ],
    },
    district: String,
    price: {
      type: Number,
      required: [ true, 'Price is required' ],
    },
    currency: {
      type: String,
      default: 'EUR',
    },
    ad_id: {
      type: String,
      required: [ true, 'Original id is required' ],
    },
    'online-viewing': Schema.Types.Boolean,
    'postal-code': {
      type: String,
      required: [ true, 'Postal code is required' ],
    },
    'reference-number': String,
    'registration-number': String,
    'registration-block': String,
    'square-meter-price': {
      type: Number,
      required: [ true, 'Square meter price is required' ],
    },
    condition: {
      type: String,
      enum: ConditionArray,
      default: Condition.Resale,
    },
    'energy-efficiency': {
      type: String,
      enum: EnergyEfficiencyArray,
      default: EnergyEfficiency.NA,
    },
    included: [ String ],
    'construction-year': String,
    type: {
      type: String,
      enum: ApartmentsFlatsTypeArray,
      default: ApartmentsFlatsType.Apartment,
    },
    floor: String,
    parking: {
      type: String,
      enum: ParkingArray,
    },
    'property-area': {
      type: Number,
      required: [ true, 'Property Area is required' ],
    },
    'property-area-unit': {
      type: String,
      default: 'm²',
      required: [ true, 'Property Area Unit is required' ],
    },
    furnishing: {
      type: String,
      enum: FurnishingArray,
      default: Furnishing.Unfurnished,
    },
    bedrooms: {
      type: Number,
      required: [ true, 'Bedrooms count is required' ],
    },
    bathrooms: {
      type: Number,
      required: [ true, 'Bathrooms count is required' ],
    },
    'air-conditioning': {
      type: String,
      enum: AirConditioningArray,
      default: AirConditioning.No,
    },
    pets: {
      type: String,
      enum: PetsArray,
      default: Pets.NotAllowed,
    },
  },
);

export const RentApartmentsFlatsModel = mongoose.model<IRentApartmentsFlatsDoc, Model<IRentApartmentsFlatsDoc>>('RentApartmentsFlats', RentApartmentsFlatsSchema);