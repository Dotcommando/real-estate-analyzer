import { Schema, Types } from 'mongoose';
import * as mongoose from 'mongoose';

import { ICityStatsDoc } from '../types';


function safeValue(doc, ret: { [key: string]: unknown }) {
  delete ret.id;
}

export const CityStatsSchema = new Schema<ICityStatsDoc<Types.ObjectId>, mongoose.Model<ICityStatsDoc<Types.ObjectId>>>(
  {
    city: {
      type: String,
    },
    'total-area': {
      type: Schema.Types.Number,
    },
    'total-price': {
      type: Schema.Types.Number,
    },
    'mean-price': {
      type: Schema.Types.Number,
    },
    'median-price': {
      type: Schema.Types.Number,
    },
    'price-percentile-25': {
      type: Schema.Types.Number,
    },
    'price-percentile-75': {
      type: Schema.Types.Number,
    },
    'mean-price-sqm': {
      type: Schema.Types.Number,
    },
    'median-price-sqm': {
      type: Schema.Types.Number,
    },
  },
  {
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: safeValue,
    },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: safeValue,
    },
  },
);
