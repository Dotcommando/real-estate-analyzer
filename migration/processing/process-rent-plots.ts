import { AnyBulkWriteOperation, ObjectId } from 'mongodb';

import { IRentPlotsDoc } from '../schemas';
import { RentAdModel, RentPlotContentModel } from '../schemas/new';
import { IAd, IPlotContent } from '../types/new';


export function processRentPlots(
  doc: IRentPlotsDoc,
  adModel: typeof RentAdModel,
  contentModel: typeof RentPlotContentModel,
  bulkAdOps: Array<AnyBulkWriteOperation<IAd<ObjectId>>>,
  bulkContentOps: Array<AnyBulkWriteOperation<IPlotContent<ObjectId>>>,
): void {

}
