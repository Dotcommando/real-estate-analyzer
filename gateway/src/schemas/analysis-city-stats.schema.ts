import { ObjectId } from 'mongodb';
import { Schema, Types } from 'mongoose';
import * as mongoose from 'mongoose';

import { CityStatsSchema } from './city-stats.schema';

import { AnalysisPeriodArray, AnalysisTypeArray } from '../constants';
import { IAnalysisDoc, ICityStats } from '../types';


function safeValue(doc, ret: { [key: string]: unknown }) {
  delete ret.id;
  delete ret._id;
  delete ret.analysis_version;
}

export const AnalysisCityStatsSchema = new Schema<IAnalysisDoc<Types.ObjectId, ICityStats>, mongoose.Model<IAnalysisDoc<Types.ObjectId, ICityStats>>>(
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
    data: [ CityStatsSchema ],
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

export const AnalysisCityStatsRentFlatsModel = mongoose.model<IAnalysisDoc<ObjectId, ICityStats>, mongoose.Model<IAnalysisDoc<ObjectId, ICityStats>>>('CityStatsRentFlats', AnalysisCityStatsSchema, 'rentapartmentsflats_analysis');
export const AnalysisCityStatsRentHousesModel = mongoose.model<IAnalysisDoc<ObjectId, ICityStats>, mongoose.Model<IAnalysisDoc<ObjectId, ICityStats>>>('CityStatsRentHouses', AnalysisCityStatsSchema, 'renthouses_analysis');
export const AnalysisCityStatsSaleFlatsModel = mongoose.model<IAnalysisDoc<ObjectId, ICityStats>, mongoose.Model<IAnalysisDoc<ObjectId, ICityStats>>>('CityStatsSaleFlats', AnalysisCityStatsSchema, 'saleapartmentsflats_analysis');
export const AnalysisCityStatsSaleHousesModel = mongoose.model<IAnalysisDoc<ObjectId, ICityStats>, mongoose.Model<IAnalysisDoc<ObjectId, ICityStats>>>('CityStatsSaleHouses', AnalysisCityStatsSchema, 'salehouses_analysis');
