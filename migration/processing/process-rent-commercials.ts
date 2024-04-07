import { AnyBulkWriteOperation, ObjectId } from 'mongodb';

import { IRentCommercialDoc } from '../schemas';
import { RentAdModel, RentCommercialContentModel } from '../schemas/new';
import { IAd, ICommercialContent } from '../types/new';


export function processRentCommercials(
  doc: IRentCommercialDoc,
  adModel: typeof RentAdModel,
  contentModel: typeof RentCommercialContentModel,
  bulkAdOps: Array<AnyBulkWriteOperation<IAd<ObjectId>>>,
  bulkContentOps: Array<AnyBulkWriteOperation<ICommercialContent<ObjectId>>>,
): void {

}
