import { ObjectId } from 'mongodb';
import * as mongoose from 'mongoose';
import { Model, Schema } from 'mongoose';

import { ShareArray } from '../../constants';
import { IPlotContent } from '../../types/new';
import { CoordsSchema } from '../coords.schema';


export const SalePlotContentSchema = new Schema<IPlotContent<ObjectId>, Model<IPlotContent<ObjectId>>>(
  {
    ad: Schema.Types.ObjectId,
    title: {
      type: String,
      required: [ true, 'Title is required' ],
    },
    description: String,
    publish_date: {
      type: Schema.Types.Date,
      required: [ true, 'Publish date is required' ],
    },
    address: {
      type: String,
      required: [ true, 'Address is required' ],
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
    'area': {
      type: Number,
      default: 0,
    },
    'area-unit': {
      type: String,
      default: 'm²',
      required: [ true, 'Plot Area Unit is required' ],
    },
    coords: {
      type: CoordsSchema,
    },
    share: {
      type: String,
      enum: ShareArray,
    },
    'planning-zone': String,
    active_dates: {
      type: [ Schema.Types.Date ] as unknown as Date[],
      required: [ true, 'Active dates are required' ],
    },
    'price-sqm': {
      type: Number,
      required: [ true, 'Price of a square meter is required' ],
      set: value => isNaN(value) || value === Infinity || value === -Infinity ? 0 : value,
    },
    photo: {
      type: [ String ],
      default: [],
    },
    ad_last_updated: {
      type: Schema.Types.Date,
      required: [ true, 'Last updated date is required' ],
    },
    updated_at: {
      type: Schema.Types.Date,
      required: [ true, 'Date of update is required' ],
    },
    version: {
      type: String,
      required: [ true, 'Document version is required' ],
    },
  },
  { collection: 'saleplotcontents' },
);

export const SalePlotContentModel = mongoose.model<IPlotContent<ObjectId>, Model<IPlotContent<ObjectId>>>('SalePlotContents', SalePlotContentSchema);
