import { Types } from 'mongoose';

import { IAnalysisDoc } from './analysis-doc.interface';
import { IDistrictStats } from './district-stats.interface';


export interface IDistrictStatsDoc<T_id = Types.ObjectId> extends IDistrictStats, IAnalysisDoc<T_id, IDistrictStats> {
  _id: T_id;
}
