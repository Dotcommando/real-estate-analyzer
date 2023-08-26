import { Schema, Types } from 'mongoose';
import * as mongoose from 'mongoose';

import { IDistrictStatsDoc } from '../types';


function safeValue(doc, ret: { [key: string]: unknown }) {
  delete ret.id;
}

export const DistrictStatsSchema = new Schema<IDistrictStatsDoc<Types.ObjectId>, mongoose.Model<IDistrictStatsDoc<Types.ObjectId>>>(
  {
    city: {
      type: String,
    },
    district: {
      type: String,
    },
    'median-sqm': {
      type: Schema.Types.Number,
    },
    'mean-sqm': {
      type: Schema.Types.Number,
    },
    count: {
      type: Schema.Types.Number,
    },
    'percentile-25-sqm': {
      type: Schema.Types.Number,
    },
    'percentile-75-sqm': {
      type: Schema.Types.Number,
    },
    'total-area': {
      type: Schema.Types.Number,
    },
    'total-price': {
      type: Schema.Types.Number,
    },
    'median-price': {
      type: Schema.Types.Number,
    },
    'mean-price': {
      type: Schema.Types.Number,
    },
    'percentile-25-price': {
      type: Schema.Types.Number,
    },
    'percentile-75-price': {
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
