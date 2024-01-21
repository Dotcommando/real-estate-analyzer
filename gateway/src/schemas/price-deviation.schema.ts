import { Schema } from 'mongoose';

import { NoStatisticsDataReasonArray } from '../constants';


export const PriceDeviationSchema = new Schema({
  medianDelta: {
    type: Number,
  },
  meanDelta: {
    type: Number,
  },
  medianDeltaSqm: {
    type: Number,
  },
  meanDeltaSqm: {
    type: Number,
  },
  noDataAbsReason: {
    type: String,
    enum: NoStatisticsDataReasonArray,
  },
  noDataSqmReason: {
    type: String,
    enum: NoStatisticsDataReasonArray,
  },
});
