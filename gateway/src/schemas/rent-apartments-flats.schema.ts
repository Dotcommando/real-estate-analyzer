import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';

import { CoordsSchema } from './coords.schema';

import {
  AirConditioning,
  AirConditioningArray,
  Condition,
  ConditionArray,
  EnergyEfficiency,
  EnergyEfficiencyArray,
  Furnishing,
  FurnishingArray,
  OnlineViewing,
  OnlineViewingArray,
  ParkingArray,
  Pets,
  PetsArray,
  PoolType,
  PoolTypeArray,
  SourceArray,
  StandardSet,
  StandardSetArray,
} from '../constants';
import { IRentApartmentsFlats } from '../types/real-estate-to-rent';
import { roundDate } from '../utils';


export interface IRentApartmentsFlatsDoc extends IRentApartmentsFlats, Document {
  active_dates: Date[];
}

export const RentApartmentsFlatsSchema = new Schema<IRentApartmentsFlatsDoc, Model<IRentApartmentsFlatsDoc>>(
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
    source: {
      type: String,
      enum: SourceArray,
      required: [ true, 'Source is required' ],
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
    'construction-year': String,
    type: {
      type: String,
      default: '',
    },
    floor: String,
    parking: {
      type: String,
      enum: ParkingArray,
    },
    'parking-places': Number,
    'property-area': {
      type: Number,
      default: 0,
    },
    'property-area-unit': {
      type: String,
      default: 'm²',
      required: [ true, 'Property Area Unit is required' ],
    },
    furnishing: {
      type: String,
      enum: FurnishingArray,
      default: Furnishing.Unfurnished,
    },
    bedrooms: {
      type: Number,
      default: 1,
    },
    bathrooms: {
      type: Number,
      default: 1,
    },
    'air-conditioning': {
      type: String,
      enum: AirConditioningArray,
      default: AirConditioning.No,
    },
    pets: {
      type: String,
      enum: PetsArray,
      default: Pets.NotAllowed,
    },
    alarm: {
      type: String,
      enum: StandardSetArray,
      default: StandardSet.NO,
    },
    attic: {
      type: String,
      enum: StandardSetArray,
      default: StandardSet.NO,
    },
    balcony: {
      type: String,
      enum: StandardSetArray,
      default: StandardSet.NO,
    },
    elevator: {
      type: String,
      enum: StandardSetArray,
      default: StandardSet.NO,
    },
    fireplace: {
      type: String,
      enum: StandardSetArray,
      default: StandardSet.NO,
    },
    garden: {
      type: String,
      enum: StandardSetArray,
      default: StandardSet.NO,
    },
    playroom: {
      type: String,
      enum: StandardSetArray,
      default: StandardSet.NO,
    },
    pool: {
      type: String,
      enum: PoolTypeArray,
      default: PoolType.No,
    },
    storage: {
      type: String,
      enum: StandardSetArray,
      default: StandardSet.NO,
    },
    active_dates: {
      type: [ Schema.Types.Date ] as unknown as Date[],
      required: [ true, 'Active dates are required' ],
    },
    coords: {
      type: CoordsSchema,
    },
    version: {
      type: String,
      required: [ true, 'Document version is required' ],
    },
    'ad_last_updated': {
      type: Schema.Types.Date,
      required: [ true, 'Last updated date is required' ],
    },
    'updated_at': {
      type: Schema.Types.Date,
      required: [ true, 'Date of update is required' ],
    },
  },
  { collection: 'rentapartmentsflats' },
);

RentApartmentsFlatsSchema.pre<IRentApartmentsFlatsDoc>('save', async function(next) {
  const currentDate = roundDate(new Date());

  if (!this.active_dates.find(date => date.getTime() === currentDate.getTime())) {
    this.active_dates.push(currentDate);
  }

  this.updated_at = new Date();

  next();
});

export const RentApartmentsFlatsModel = mongoose.model<IRentApartmentsFlatsDoc, Model<IRentApartmentsFlatsDoc>>('RentApartmentsFlats', RentApartmentsFlatsSchema);
