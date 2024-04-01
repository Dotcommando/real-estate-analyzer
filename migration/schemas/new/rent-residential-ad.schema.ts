import { ObjectId } from 'mongodb';
import * as mongoose from 'mongoose';
import { Model, Schema } from 'mongoose';

import { SourceArray } from '../../constants';
import { IResidentialAd } from '../../types/new/residential-ad.interface';


export const RentResidentialAdSchema = new Schema<IResidentialAd<ObjectId, ObjectId>, Model<IResidentialAd<ObjectId, ObjectId>>>(
  {
    ad_id: {
      type: String,
      required: [ true, 'Original id is required' ],
    },
    url: {
      type: String,
      required: [ true, 'URL is required' ],
    },
    source: {
      type: String,
      enum: SourceArray,
      required: [ true, 'Source is required' ],
    },
    'ad_last_updated': {
      type: Schema.Types.Date,
      required: [ true, 'Last updated date is required' ],
    },
    'updated_at': {
      type: Schema.Types.Date,
      required: [ true, 'Date of update is required' ],
    },
    content: {
      type: [ Schema.Types.ObjectId ],
      default: [],
    },
    version: {
      type: String,
      required: [ true, 'Document version is required' ],
    },
  },
  { collection: 'rentresidentialads' },
);

export const RentResidentialAdModel = mongoose.model<IResidentialAd<ObjectId, ObjectId>, Model<IResidentialAd<ObjectId, ObjectId>>>('RentResidentialAds', RentResidentialAdSchema);
