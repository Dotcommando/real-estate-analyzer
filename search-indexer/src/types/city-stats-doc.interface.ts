import { Types } from 'mongoose';

import { ICityStats } from './city-stats.interface';


export interface ICityStatsDoc<T_id = Types.ObjectId> extends ICityStats {
  _id: T_id;
}
