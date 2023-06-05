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
import { roundDate } from '../utils';


export interface ISaleApartmentsFlatsDoc extends ISaleApartmentsFlats, Document {
  active_dates: Date[];
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
    description: String,
    publish_date: {
      type: Schema.Types.Date,
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
    active_dates: {
      type: [ Schema.Types.Date ] as unknown as Date[],
      required: [ true, 'Active dates are required' ],
    },
  },
);

SaleApartmentsFlatsSchema.pre<ISaleApartmentsFlatsDoc>('save', async function(next) {
  const currentDate = roundDate(new Date());

  if (!this.active_dates.find(date => date.getTime() === currentDate.getTime())) {
    this.active_dates.push(currentDate);
  }

  next();
});

export const SaleApartmentsFlatsModel = mongoose.model<ISaleApartmentsFlatsDoc, Model<ISaleApartmentsFlatsDoc>>('SaleApartmentsFlats', SaleApartmentsFlatsSchema);
