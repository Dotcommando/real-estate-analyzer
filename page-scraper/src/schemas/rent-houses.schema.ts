import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';

import {
  AirConditioningArray,
  Condition,
  ConditionArray,
  EnergyEfficiency,
  EnergyEfficiencyArray,
  FurnishingArray,
  HousesTypeArray,
  ParkingArray,
  PetsArray,
} from '../constants';
import { IRentHouses } from '../types/real-estate-to-rent';


export interface IRentHousesDoc extends IRentHouses, Document {
}

export const RentHousesSchema = new Schema<IRentHousesDoc, Model<IRentHousesDoc>>(
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
    'property-area': {
      type: Number,
      required: [ true, 'Property Area is required' ],
    },
    'property-area-unit': {
      type: String,
      default: 'm²',
      required: [ true, 'Property Area Unit is required' ],
    },
    type: {
      type: String,
      enum: HousesTypeArray,
      required: [ true, 'Type is required' ],
    },
    parking: {
      type: String,
      enum: ParkingArray,
    },
    furnishing: {
      type: String,
      enum: FurnishingArray,
    },
    'air-conditioning': {
      type: String,
      enum: AirConditioningArray,
    },
    bedrooms: {
      type: Number,
      required: [ true, 'Number of bedrooms is required' ],
    },
    bathrooms: {
      type: Number,
      required: [ true, 'Number of bathrooms is required' ],
    },
    pets: {
      type: String,
      enum: PetsArray,
      required: [ true, 'Pets policy is required' ],
    },
    'plot-area': {
      type: Number,
      required: [ true, 'Plot Area is required' ],
    },
    'plot-area-unit': {
      type: String,
      default: 'm²',
      required: [ true, 'Plot Area Unit is required' ],
    },
  },
);

export const RentHousesModel = mongoose.model<IRentHousesDoc, Model<IRentHousesDoc>>('RentHouses', RentHousesSchema);
