import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';

import {
  Mode,
  ModeArray,
  OnlineViewing,
  OnlineViewingArray,
  PlotType,
  PlotTypeArray,
  Share,
  ShareArray,
} from '../constants';
import { IRentPlots } from '../types/real-estate-to-rent';
import { roundDate } from '../utils';


export interface IRentPlotsDoc extends IRentPlots, Document {
  active_dates: Date[];
  mode?: Mode;
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
    'plot-area': {
      type: Number,
      default: 0,
    },
    'plot-area-unit': {
      type: String,
      default: 'm²',
      required: [ true, 'Plot Area Unit is required' ],
    },
    'plot-type': {
      type: String,
      enum: PlotTypeArray,
      default: PlotType.NotSpecified,
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
    active_dates: {
      type: [ Schema.Types.Date ] as unknown as Date[],
      required: [ true, 'Active dates are required' ],
    },
    mode: {
      type: String,
      enum: ModeArray,
      default: Mode.Prod,
    },
  },
);

RentPlotsSchema.pre<IRentPlotsDoc>('save', async function(next) {
  const currentDate = roundDate(new Date());

  if (!this.active_dates.find(date => date.getTime() === currentDate.getTime())) {
    this.active_dates.push(currentDate);
  }

  next();
});

export const RentPlotsModel = mongoose.model<IRentPlotsDoc, Model<IRentPlotsDoc>>('RentPlots', RentPlotsSchema);
