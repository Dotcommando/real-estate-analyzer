import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';

import { CoordsSchema } from './coords.schema';

import {
  AirConditioningArray,
  Condition,
  ConditionArray,
  EnergyEfficiency,
  EnergyEfficiencyArray,
  FurnishingArray,
  Mode,
  ModeArray,
  OnlineViewing,
  OnlineViewingArray,
  ParkingArray,
  Pets,
  PetsArray,
} from '../constants';
import { IRentHouses } from '../types/real-estate-to-rent';
import { roundDate } from '../utils';


export interface IRentHousesDoc extends IRentHouses, Document {
  active_dates: Date[];
  mode?: Mode;
}

export const RentHousesSchema = new Schema<IRentHousesDoc, Model<IRentHousesDoc>>(
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
    'property-area': {
      type: Number,
      default: 0,
    },
    'property-area-unit': {
      type: String,
      default: 'm²',
      required: [ true, 'Property Area Unit is required' ],
    },
    type: {
      type: String,
      default: '',
    },
    parking: {
      type: String,
      enum: ParkingArray,
    },
    furnishing: {
      type: String,
      enum: FurnishingArray,
    },
    'air-conditioning': {
      type: String,
      enum: AirConditioningArray,
    },
    bedrooms: {
      type: Number,
      default: 1,
    },
    bathrooms: {
      type: Number,
      default: 1,
    },
    pets: {
      type: String,
      enum: PetsArray,
      default: Pets.NotAllowed,
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
  { collection: 'renthouses' },
);

RentHousesSchema.pre<IRentHousesDoc>('save', async function(next) {
  const currentDate = roundDate(new Date());

  if (!this.active_dates.find(date => date.getTime() === currentDate.getTime())) {
    this.active_dates.push(currentDate);
  }

  next();
});

export const RentHousesModel = mongoose.model<IRentHousesDoc, Model<IRentHousesDoc>>('RentHouses', RentHousesSchema);
