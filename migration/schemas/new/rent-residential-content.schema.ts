import { ObjectId } from 'mongodb';
import * as mongoose from 'mongoose';
import { Model, Schema } from 'mongoose';

import {
  AirConditioning,
  AirConditioningArray,
  EnergyEfficiency,
  EnergyEfficiencyArray,
  FloorArray,
  Furnishing,
  FurnishingArray,
  ParkingArray,
  Pets,
  PetsArray,
  PoolType,
  PoolTypeArray,
  StandardSet,
  StandardSetArray,
} from '../../constants';
import { IResidentialContent } from '../../types/new';
import { CoordsSchema } from '../coords.schema';


export const RentResidentialContentSchema = new Schema<IResidentialContent<ObjectId>, Model<IResidentialContent<ObjectId>>>(
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
    'postal-code': Number,
    'registration-number': String,
    'registration-block': String,
    'energy-efficiency': {
      type: String,
      enum: EnergyEfficiencyArray,
      default: EnergyEfficiency.NA,
    },
    'construction-year': String,
    floor: {
      type: String,
      enum: FloorArray,
      default: null,
    },
    'parking-places': Number,
    'area': {
      type: Number,
      default: 0,
    },
    'area-unit': {
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
    parking: {
      type: String,
      enum: ParkingArray,
    },
    coords: {
      type: CoordsSchema,
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
  { collection: 'rentresidentialcontents' },
);

export const RentResidentialContentModel = mongoose.model<IResidentialContent<ObjectId>, Model<IResidentialContent<ObjectId>>>('RentResidentialContents', RentResidentialContentSchema);
