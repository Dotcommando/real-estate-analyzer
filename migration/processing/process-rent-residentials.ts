import { AnyBulkWriteOperation, ObjectId } from 'mongodb';

import { IRentApartmentsFlatsDoc, IRentHousesDoc } from '../schemas';
import { RentAdModel, RentResidentialContentModel } from '../schemas/new';
import { IAd, IResidentialContent } from '../types/new';


export function processRentResidentials(
  doc: IRentApartmentsFlatsDoc | IRentHousesDoc,
  adModel: typeof RentAdModel,
  contentModel: typeof RentResidentialContentModel,
  bulkAdOps: Array<AnyBulkWriteOperation<IAd<ObjectId>>>,
  bulkContentOps: Array<AnyBulkWriteOperation<IResidentialContent<ObjectId>>>,
): void {

}
