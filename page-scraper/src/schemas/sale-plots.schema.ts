import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';

import {
  PlotTypeArray,
  ShareArray,
} from '../constants';
import { ISalePlots } from '../types/real-estate-for-sale';
import { roundDate } from '../utils';


export interface ISalePlotsDoc extends ISalePlots, Document {
  active_dates: Date[];
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
    active_dates: {
      type: [ Schema.Types.Date ] as unknown as Date[],
      required: [ true, 'Active dates are required' ],
    },
  },
);

SalePlotsSchema.pre<ISalePlotsDoc>('save', async function(next) {
  const currentDate = roundDate(new Date());

  if (!this.active_dates.find(date => date.getTime() === currentDate.getTime())) {
    this.active_dates.push(currentDate);
  }

  next();
});

export const SalePlotsModel = mongoose.model<ISalePlotsDoc, Model<ISalePlotsDoc>>('SalePlots', SalePlotsSchema);
