import { AnyBulkWriteOperation, ObjectId } from 'mongodb';

import { ISaleCommercialDoc } from '../schemas';
import { SaleAdModel, SaleCommercialContentModel } from '../schemas/new';
import { IAd, ICommercialContent } from '../types/new';


export function processSaleCommercials(
  doc: ISaleCommercialDoc,
  adModel: typeof SaleAdModel,
  contentModel: typeof SaleCommercialContentModel,
  bulkAdOps: Array<AnyBulkWriteOperation<IAd<ObjectId>>>,
  bulkContentOps: Array<AnyBulkWriteOperation<ICommercialContent<ObjectId>>>,
): void {

}
