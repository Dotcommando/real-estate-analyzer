import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';

import { PlotTypeArray, Share, ShareArray } from '../constants';
import { IRentPlots } from '../types/real-estate-to-rent';


export interface IRentPlotsDoc extends IRentPlots, Document {
}

export const RentPlotsSchema = new Schema<IRentPlotsDoc, Model<IRentPlotsDoc>>(
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
    'plot-area': {
      type: Number,
      required: [ true, 'Plot Area is required' ],
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
      default: Share.No,
    },
    'parcel-number': String,
    'planning-zone': String,
    density: String,
    coverage: String,
  },
);

export const RentPlotsModel = mongoose.model<IRentPlotsDoc, Model<IRentPlotsDoc>>('RentPlots', RentPlotsSchema);
