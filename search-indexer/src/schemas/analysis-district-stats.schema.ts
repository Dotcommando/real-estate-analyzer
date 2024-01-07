import { ObjectId } from 'mongodb';
import { Schema, Types } from 'mongoose';
import * as mongoose from 'mongoose';

import { DistrictStatsSchema } from './district-stats.schema';

import { AnalysisPeriodArray, AnalysisTypeArray } from '../constants';
import { IAnalysisDoc, IDistrictStats, IDistrictStatsDoc } from '../types';


function safeValue(doc, ret: { [key: string]: unknown }) {
  delete ret.id;
  delete ret._id;
  delete ret.analysis_version;
}

export const AnalysisDistrictStatsSchema = new Schema<IAnalysisDoc<Types.ObjectId, IDistrictStats>, mongoose.Model<IAnalysisDoc<Types.ObjectId, IDistrictStats>>>(
  {
    start_date: {
      type: Schema.Types.Date,
    },
    end_date: {
      type: Schema.Types.Date,
    },
    analysis_type: {
      type: String,
      enum: [ ...AnalysisTypeArray ],
    },
    analysis_period: {
      type: String,
      enum: [ ...AnalysisPeriodArray ],
    },
    analysis_version: {
      type: String,
    },
    data: [ DistrictStatsSchema ],
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

export const AnalysisDistrictStatsRentFlatsModel = mongoose.model<IAnalysisDoc<ObjectId, IDistrictStats>, mongoose.Model<IAnalysisDoc<ObjectId, IDistrictStats>>>('DistrictStatsRentFlats', AnalysisDistrictStatsSchema, 'rentapartmentsflats_analysis');
export const AnalysisDistrictStatsRentHousesModel = mongoose.model<IAnalysisDoc<ObjectId, IDistrictStats>, mongoose.Model<IAnalysisDoc<ObjectId, IDistrictStats>>>('DistrictStatsRentHouses', AnalysisDistrictStatsSchema, 'renthouses_analysis');
export const AnalysisDistrictStatsSaleFlatsModel = mongoose.model<IAnalysisDoc<ObjectId, IDistrictStats>, mongoose.Model<IAnalysisDoc<ObjectId, IDistrictStats>>>('DistrictStatsSaleFlats', AnalysisDistrictStatsSchema, 'saleapartmentsflats_analysis');
export const AnalysisDistrictStatsSaleHousesModel = mongoose.model<IAnalysisDoc<ObjectId, IDistrictStats>, mongoose.Model<IAnalysisDoc<ObjectId, IDistrictStats>>>('DistrictStatsSaleHouses', AnalysisDistrictStatsSchema, 'salehouses_analysis');
