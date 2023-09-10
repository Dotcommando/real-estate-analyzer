import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';

import { CoordsSchema } from './coords.schema';

import {
  Condition,
  ConditionArray,
  EnergyEfficiency,
  EnergyEfficiencyArray,
  Mode,
  ModeArray,
  OnlineViewing,
  OnlineViewingArray,
} from '../constants';
import { ISaleCommercials } from '../types/real-estate-for-sale';
import { roundDate } from '../utils';


export interface ISaleCommercialDoc extends ISaleCommercials, Document {
  active_dates: Date[];
  mode?: Mode;
}

export const SaleCommercialsSchema = new Schema<ISaleCommercialDoc, Model<ISaleCommercialDoc>>(
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
    'online-viewing': {
      type: String,
      enum: OnlineViewingArray,
      default: OnlineViewing.No,
    },
    'postal-code': {
      type: String,
      default: '',
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
      default: '',
    },
    area: {
      type: Number,
      default: 0,
    },
    'area-unit': {
      type: String,
      default: 'm²',
      required: [ true, 'Area Unit is required' ],
    },
    'plot-area': {
      type: Number,
      default: 0,
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
    coords: {
      type: CoordsSchema,
    },
    mode: {
      type: String,
      enum: ModeArray,
      default: Mode.Prod,
    },
  },
  { collection: 'salecommercials' },
);

SaleCommercialsSchema.pre<ISaleCommercialDoc>('save', async function(next) {
  const currentDate = roundDate(new Date());

  if (!this.active_dates.find(date => date.getTime() === currentDate.getTime())) {
    this.active_dates.push(currentDate);
  }

  next();
});

export const SaleCommercialsModel = mongoose.model<ISaleCommercialDoc, Model<ISaleCommercialDoc>>('SaleCommercials', SaleCommercialsSchema);
