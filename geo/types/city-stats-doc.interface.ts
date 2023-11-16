import { Document, Types } from 'mongoose';

import { ICityStats } from './city-stats.interface';


export interface ICityStatsDoc<T_id = Types.ObjectId> extends ICityStats, Document {
  _id: T_id;
}
