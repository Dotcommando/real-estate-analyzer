import { Schema } from 'mongoose';

import { PriceDeviationSchema } from './price-deviation.schema';

import { AnalysisPeriod } from '../constants';


export const AnalysisTypeDeviationsSchema = new Schema({
  [AnalysisPeriod.MONTHLY_TOTAL]: {
    type: PriceDeviationSchema,
    required: true,
  },
  [AnalysisPeriod.MONTHLY_INTERMEDIARY]: {
    type: PriceDeviationSchema,
    required: true,
  },
  [AnalysisPeriod.DAILY_TOTAL]: {
    type: PriceDeviationSchema,
    required: true,
  },
});
