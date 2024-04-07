import { AnyBulkWriteOperation, ObjectId } from 'mongodb';

import { ISaleApartmentsFlatsDoc, ISaleHousesDoc } from '../schemas';
import { SaleAdModel, SaleResidentialContentModel } from '../schemas/new';
import { IAd, IResidentialContent } from '../types/new';


export function processSaleResidentials(
  doc: ISaleApartmentsFlatsDoc | ISaleHousesDoc,
  adModel: typeof SaleAdModel,
  contentModel: typeof SaleResidentialContentModel,
  bulkAdOps: Array<AnyBulkWriteOperation<IAd<ObjectId>>>,
  bulkContentOps: Array<AnyBulkWriteOperation<IResidentialContent<ObjectId>>>,
): void {

}
