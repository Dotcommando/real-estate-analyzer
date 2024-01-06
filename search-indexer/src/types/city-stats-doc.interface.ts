import { Types } from 'mongoose';

import { IAnalysisDoc } from './analysis-doc.interface';
import { ICityStats } from './city-stats.interface';


export interface ICityStatsDoc<T_id = Types.ObjectId> extends ICityStats, IAnalysisDoc<T_id, ICityStats> {
  _id: T_id;
}
