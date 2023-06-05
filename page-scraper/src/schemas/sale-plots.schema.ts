import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';

import {
  Condition,
  ConditionArray,
  EnergyEfficiency,
  EnergyEfficiencyArray,
  PlotTypeArray,
  ShareArray,
} from '../constants';
import { ISalePlots } from '../types/real-estate-for-sale';


export interface ISalePlotsDoc extends ISalePlots, Document {
}

export const SalePlotsSchema = new Schema<ISalePlotsDoc, Model<ISalePlotsDoc>>(
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
      required: [ true, 'Ad id is required' ],
    },
    'online-viewing': Schema.Types.Boolean,
    'postal-code': {
      type: String,
      required: [ true, 'Postal code is required' ],
    },
    'reference-number': String,
    'registration-number': Number,
    'registration-block': Number,
    'square-meter-price': {
      type: Number,
      required: [ true, 'Square meter price is required' ],
    },
    'plot-area': {
      type: Number,
      required: [ true, 'Plot area is required' ],
    },
    'plot-area-unit': {
      type: String,
      default: 'm²',
      required: [ true, 'Plot Area Unit is required' ],
    },
    'plot-type': {
      type: String,
      enum: PlotTypeArray,
      required: [ true, 'Plot Type is required' ],
    },
    share: {
      type: String,
      enum: ShareArray,
    },
    'planning-zone': String,
    density: String,
    coverage: String,
    'parcel-number': String,
  },
);

export const SalePlotsModel = mongoose.model<ISalePlotsDoc, Model<ISalePlotsDoc>>('SalePlots', SalePlotsSchema);
