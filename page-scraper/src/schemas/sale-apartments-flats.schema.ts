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
  ParkingArray,
} from '../constants';
import { ISaleApartmentsFlats } from '../types/real-estate-for-sale';


export interface ISaleApartmentsFlatsDoc extends ISaleApartmentsFlats, Document {
}

export const SaleApartmentsFlatsSchema = new Schema<ISaleApartmentsFlatsDoc, Model<ISaleApartmentsFlatsDoc>>(
  {
    url: {
      type: String,
      required: [ true, 'URL is required' ],
    },
    title: {
      type: String,
      required: [ true, 'Title is required' ],
    },
    description: {
      type: String,
    },
    publish_date: {
      type: Number,
      required: [ true, 'Publish date is required' ],
    },
    city: {
      type: String,
      required: [ true, 'City is required' ],
    },
    district: {
      type: String,
    },
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
    floor: {
      type: String,
    },
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
      required: [ true, 'Bedrooms is required' ],
    },
    bathrooms: {
      type: Number,
      required: [ true, 'Bathrooms is required' ],
    },
    'air-conditioning': {
      type: String,
      enum: AirConditioningArray,
      default: AirConditioning.No,
    },
  },
);

export const SaleApartmentsFlatsModel = mongoose.model<ISaleApartmentsFlatsDoc, Model<ISaleApartmentsFlatsDoc>>('SaleApartmentsFlats', SaleApartmentsFlatsSchema);
