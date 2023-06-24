import * as mongoose from 'mongoose';
import { Document } from 'mongoose';


export function serializeDoc(doc: Document): Object {
  const newDoc = doc.toObject();

  newDoc._id = { '$oid': newDoc._id.toString() };

  for (const key in newDoc) {
    if (newDoc[key] instanceof mongoose.Types.ObjectId) {
      newDoc[key] = { '$oid': newDoc[key].toString() };
    } else if (newDoc[key] instanceof Date) {
      newDoc[key] = { '$date': newDoc[key].toISOString() };
    } else if (Array.isArray(newDoc[key])) {
      if (newDoc[key].every(item => item instanceof mongoose.Types.ObjectId)) {
        newDoc[key] = newDoc[key].map(oid => ({ '$oid': oid.toString() }));
      } else if (newDoc[key].every(item => item instanceof Date)) {
        newDoc[key] = newDoc[key].map(date => ({ '$date': date.toISOString() }));
      }
    }
  }

  return newDoc;
}
