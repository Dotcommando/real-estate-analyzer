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
} from '../constants';
import { ISaleHouses } from '../types/real-estate-for-sale';
import { roundDate } from '../utils';


export interface ISaleHousesDoc extends ISaleHouses, Document {
  active_dates: Date[];
}

export const SaleHousesSchema = new Schema<ISaleHousesDoc, Model<ISaleHousesDoc>>(
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
    'property-area': {
      type: Number,
      required: [ true, 'Property area is required' ],
    },
    'property-area-unit': {
      type: String,
      default: 'm²',
      required: [ true, 'Property Area Unit is required' ],
    },
    type: {
      type: String,
      enum: HousesTypeArray,
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
      required: [ true, 'Bedrooms count is required' ],
    },
    bathrooms: {
      type: Number,
      required: [ true, 'Bathrooms count is required' ],
    },
    active_dates: {
      type: [ Schema.Types.Date ] as unknown as Date[],
      required: [ true, 'Active dates are required' ],
    },
  },
);

SaleHousesSchema.pre<ISaleHousesDoc>('save', async function(next) {
  const currentDate = roundDate(new Date());

  if (!this.active_dates.find(date => date.getTime() === currentDate.getTime())) {
    this.active_dates.push(currentDate);
  }

  next();
});

export const SaleHousesModel = mongoose.model<ISaleHousesDoc, Model<ISaleHousesDoc>>('SaleHouses', SaleHousesSchema);
