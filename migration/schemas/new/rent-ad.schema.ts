import { ObjectId } from 'mongodb';
import * as mongoose from 'mongoose';
import { Model, Schema } from 'mongoose';

import { CategoriesArray, SourceArray } from '../../constants';
import { IAd } from '../../types/new';


export const RentAdSchema = new Schema<IAd<ObjectId, ObjectId>, Model<IAd<ObjectId, ObjectId>>>(
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
    category: {
      type: String,
      enum: CategoriesArray,
      required: [ true, 'Category required, technically it is a collection where the document from' ],
    },
    subcategory: {
      type: String,
      default: '',
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
  { collection: 'rentads' },
);

export const RentAdModel = mongoose.model<IAd<ObjectId, ObjectId>, Model<IAd<ObjectId, ObjectId>>>('RentAds', RentAdSchema);
