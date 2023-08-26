import { Schema, Types } from 'mongoose';
import * as mongoose from 'mongoose';

import { CityStatsSchema } from './city-stats.schema';

import { AnalysisPeriodArray, AnalysisTypeArray } from '../constants';
import { IAnalysisDoc, ICityStats, ICityStatsDoc } from '../types';


function safeValue(doc, ret: { [key: string]: unknown }) {
  delete ret.id;
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

export const AnalysisCityStatsRentFlatsModel = mongoose.model<ICityStatsDoc, mongoose.Model<ICityStatsDoc>>('CityStatsRentFlats', AnalysisCityStatsSchema, 'rentapartmentsflats_analysis');
export const AnalysisCityStatsRentHousesModel = mongoose.model<ICityStatsDoc, mongoose.Model<ICityStatsDoc>>('CityStatsRentHouses', AnalysisCityStatsSchema, 'renthouses_analysis');
export const AnalysisCityStatsSaleFlatsModel = mongoose.model<ICityStatsDoc, mongoose.Model<ICityStatsDoc>>('CityStatsSaleFlats', AnalysisCityStatsSchema, 'saleapartmentsflats_analysis');
export const AnalysisCityStatsSaleHousesModel = mongoose.model<ICityStatsDoc, mongoose.Model<ICityStatsDoc>>('CityStatsSaleHouses', AnalysisCityStatsSchema, 'salehouses_analysis');
