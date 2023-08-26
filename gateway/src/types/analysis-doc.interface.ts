import { Document, Types } from 'mongoose';

import { IAnalysis } from './analysis.interface';


export interface IAnalysisDoc<T_id = Types.ObjectId, T = unknown> extends Omit<IAnalysis, '_id'>, Document<T_id> {
  data: T[];
}
