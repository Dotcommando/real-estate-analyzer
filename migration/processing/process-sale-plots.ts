import { AnyBulkWriteOperation, ObjectId } from 'mongodb';

import { ISalePlotsDoc } from '../schemas';
import { SaleAdModel, SalePlotContentModel } from '../schemas/new';
import { IAd, IPlotContent } from '../types/new';


export function processSalePlots(
  doc: ISalePlotsDoc,
  adModel: typeof SaleAdModel,
  contentModel: typeof SalePlotContentModel,
  bulkAdOps: Array<AnyBulkWriteOperation<IAd<ObjectId>>>,
  bulkContentOps: Array<AnyBulkWriteOperation<IPlotContent<ObjectId>>>,
): void {

}
