import * as mongoose from 'mongoose';
import { Model, Schema } from 'mongoose';

import { AnalysisTypeDeviationsSchema } from './analysis-type-deviations.schema';
import { CoordsSchema } from './coords.schema';

import {
  AirConditioning,
  AirConditioningArray,
  AnalysisType,
  CategoriesArray,
  Condition,
  ConditionArray,
  EnergyEfficiency,
  EnergyEfficiencyArray,
  Furnishing,
  FurnishingArray,
  OnlineViewing,
  OnlineViewingArray,
  ParkingArray,
  PoolType,
  PoolTypeArray,
  SourceArray,
  StandardSet,
  StandardSetArray,
} from '../constants';
import { ISaleResidential } from '../types';


export const SaleResidentialSchema = new Schema<ISaleResidential, Model<ISaleResidential>>(
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
    coords: {
      type: CoordsSchema,
    },
    'ad_last_updated': {
      type: Schema.Types.Date,
      required: [ true, 'Last updated date is required' ],
    },
    'updated_at': {
      type: Schema.Types.Date,
      required: [ true, 'Date of update is required' ],
    },
    category: {
      type: String,
      enum: CategoriesArray,
      required: [ true, 'Category required, technically it is a collection where the document from' ],
    },
    subcategory: {
      type: String,
      default: '',
    },
    activeDays: {
      type: Number,
      default: 0,
    },
    'price-sqm': {
      type: Number,
      required: [ true, 'Price of a square meter is required' ],
      set: value => isNaN(value) || value === Infinity || value === -Infinity ? 0 : value,
    },
    priceDeviations: {
      [AnalysisType.CITY_AVG_MEAN]: {
        type: AnalysisTypeDeviationsSchema,
        required: true,
      },
      [AnalysisType.DISTRICT_AVG_MEAN]: {
        type: AnalysisTypeDeviationsSchema,
        required: true,
      },
    },
  },
  { collection: 'sr_saleresidentials' },
);

export const SaleResidentialModel = mongoose.model<ISaleResidential, Model<ISaleResidential>>('SaleResidentials', SaleResidentialSchema);
