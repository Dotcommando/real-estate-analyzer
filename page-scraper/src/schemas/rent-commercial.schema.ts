import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';

import {
  CommercialTypeArray,
  Condition,
  ConditionArray,
  EnergyEfficiency,
  EnergyEfficiencyArray,
} from '../constants';
import { IRentCommercial } from '../types/real-estate-to-rent';
import { roundDate } from '../utils';


export interface IRentCommercialDoc extends IRentCommercial, Document {
  active_dates: Date[];
}

export const RentCommercialSchema = new Schema<IRentCommercialDoc, Model<IRentCommercialDoc>>(
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
      enum: CommercialTypeArray,
      required: [ true, 'Commercial Type is required' ],
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
    'plot-area': {
      type: Number,
      required: [ true, 'Plot Area is required' ],
    },
    'plot-area-unit': {
      type: String,
      default: 'm²',
      required: [ true, 'Plot Area Unit is required' ],
    },
    active_dates: {
      type: [ Schema.Types.Date ] as unknown as Date[],
      required: [ true, 'Active dates are required' ],
    },
  },
);

RentCommercialSchema.pre<IRentCommercialDoc>('save', async function(next) {
  const currentDate = roundDate(new Date());

  if (!this.active_dates.find(date => date.getTime() === currentDate.getTime())) {
    this.active_dates.push(currentDate);
  }

  next();
});

export const RentCommercialModel = mongoose.model<IRentCommercialDoc, Model<IRentCommercialDoc>>('RentCommercial', RentCommercialSchema);
