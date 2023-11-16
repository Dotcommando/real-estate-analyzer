import { Document, Types } from 'mongoose';

import { IDistrictStats } from './district-stats.interface';


export interface IDistrictStatsDoc<T_id = Types.ObjectId> extends IDistrictStats, Document {
  _id: T_id;
}
