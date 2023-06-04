import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';

import { CommercialTypeArray, Condition, ConditionArray, EnergyEfficiency, EnergyEfficiencyArray } from '../constants';
import { ISaleCommercial } from '../types/real-estate-for-sale';


export interface ISaleCommercialDoc extends ISaleCommercial, Document {
}

export const SaleCommercialSchema = new Schema<ISaleCommercialDoc, Model<ISaleCommercialDoc>>(
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
      enum: CommercialTypeArray,
    },
    area: {
      type: Number,
      required: [ true, 'Area is required' ],
    },
    'area-unit': {
      type: String,
      default: 'm²',
      required: [ true, 'Area Unit is required' ],
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

export const SaleCommercialModel = mongoose.model<ISaleCommercialDoc, Model<ISaleCommercialDoc>>('SaleCommercial', SaleCommercialSchema);
