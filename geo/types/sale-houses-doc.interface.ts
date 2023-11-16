import { Document, Types } from 'mongoose';

import { ISaleHouses } from './sale-houses.interface';


export interface ISaleHousesDoc<T_id = Types.ObjectId> extends ISaleHouses, Document {
  _id: T_id;
}
