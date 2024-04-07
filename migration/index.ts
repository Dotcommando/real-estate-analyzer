import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import * as path from 'path';

import {
  processRentCommercials,
  processRentPlots,
  processRentResidentials,
  processSaleCommercials,
  processSalePlots,
  processSaleResidentials,
} from './processing';
import {
  IRentApartmentsFlatsDoc,
  IRentCommercialDoc,
  IRentHousesDoc,
  IRentPlotsDoc,
  ISaleApartmentsFlatsDoc,
  ISaleCommercialDoc,
  ISaleHousesDoc,
  ISalePlotsDoc,
} from './schemas';
import {
  RentAdModel,
  RentCommercialContentModel,
  RentPlotContentModel,
  SaleAdModel,
  SaleCommercialContentModel,
  SalePlotContentModel,
} from './schemas/new';
import { IAsyncArrayIterator } from './types';
import { debugError, debugLog, getArrayIterator, getBatchIterator, getModelByCollectionName } from './utils';


const envPath = path.resolve(__dirname, '.env');

dotenv.config({ path: envPath });

const sourceCollections: string[] = [
  'rentapartmentsflats',
  'rentcommercials',
  'renthouses',
  'rentplots',
  'saleapartmentsflats',
  'salecommercials',
  'salehouses',
  'saleplots',
];

const targetAdCollections: string[] = [
  'rentads',
  'saleads',
];

const targetContentCollections: string[] = [
  'rentcommercialcontents',
  'rentplotcontents',
  'rentresidentialcontents',
  'salecommercialcontents',
  'saleplotcontents',
  'saleresidentialcontents',
];

const batchSize = 200;

export function getModelBySourceCollection(sourceCollection: string): [ Model<unknown>, Model<unknown> ] {
  const adCollectionModel: Model<unknown> = sourceCollection.startsWith('rent')
    ? getModelByCollectionName('rentads')
    : getModelByCollectionName('saleads');
  let contentCollectionModel: Model<unknown>;

  if (sourceCollection === 'rentapartmentsflats' || sourceCollection === 'renthouses') {
    contentCollectionModel = getModelByCollectionName('rentresidentialcontents');
  } else if (sourceCollection === 'rentcommercials') {
    contentCollectionModel = getModelByCollectionName('rentcommercialcontents');
  } else if (sourceCollection === 'rentplotcontents') {
    contentCollectionModel = getModelByCollectionName('rentplotcontents');
  } else if (sourceCollection === 'saleapartmentsflats' || sourceCollection === 'salehouses') {
    contentCollectionModel = getModelByCollectionName('saleresidentialcontents');
  } else if (sourceCollection === 'salecommercials') {
    contentCollectionModel = getModelByCollectionName('salecommercialcontents');
  } else {
    contentCollectionModel = getModelByCollectionName('saleplotcontents');
  }

  return [ adCollectionModel, contentCollectionModel ];
}

try {
  const DSN = `${process.env.MONGO_PROTOCOL}://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_INITDB_DATABASE}?authSource=admin${process.env.MONGO_RS ? '&replicaSet=' + process.env.MONGO_RS : ''}&ssl=false`;

  mongoose.connect(DSN)
    .then(migration)
    .then(() => process.exit(0));
} catch (err) {
  console.error(err);
  process.exit(1);
}

async function migration() {
  const collectionsArrayIterator: IAsyncArrayIterator<string> = getArrayIterator(sourceCollections);

  for await (const collectionName of collectionsArrayIterator) {
    debugLog('');
    debugLog(`Collection: ${collectionName}`);

    const sourceCollectionModel = getModelByCollectionName(collectionName);
    const [ adCollectionModel, contentCollectionModel ] = getModelBySourceCollection(collectionName);
    const totalDocs = await sourceCollectionModel.count({});

    if (!adCollectionModel || !contentCollectionModel) {
      debugError(`Cannot get model for collection ${collectionName}.`);

      continue;
    }

    const docsIterator = getBatchIterator(sourceCollectionModel, batchSize);
    let offset = 0;

    for await (const adsDocs of docsIterator) {
      const lastDocNumber = offset + batchSize - 1 < totalDocs - 1
        ? offset + batchSize - 1
        : totalDocs - 1;

      debugLog(`Processing batch ${offset}-${lastDocNumber} of ${totalDocs} documents...`);

      const bulkAdOps = [];
      const bulkContentOps = [];

      for (const doc of adsDocs) {
        if (collectionName === 'rentapartmentsflats' || collectionName === 'renthouses') {
          processRentResidentials(
            doc as IRentApartmentsFlatsDoc | IRentHousesDoc,
            collectionName,
            bulkAdOps,
            bulkContentOps,
          );
        } else if (collectionName === 'saleapartmentsflats' || collectionName === 'salehouses') {
          processSaleResidentials(
            doc as ISaleApartmentsFlatsDoc | ISaleHousesDoc,
            collectionName,
            bulkAdOps,
            bulkContentOps,
          );
        } else if (collectionName === 'rentcommercials') {
          processRentCommercials(
            doc as IRentCommercialDoc,
            adCollectionModel as typeof RentAdModel,
            contentCollectionModel as typeof RentCommercialContentModel,
            bulkAdOps,
            bulkContentOps,
          );
        } else if (collectionName === 'salecommercials') {
          processSaleCommercials(
            doc as ISaleCommercialDoc,
            adCollectionModel as typeof SaleAdModel,
            contentCollectionModel as typeof SaleCommercialContentModel,
            bulkAdOps,
            bulkContentOps,
          );
        } else if (collectionName === 'saleplots') {
          processSalePlots(
            doc as ISalePlotsDoc,
            adCollectionModel as typeof SaleAdModel,
            contentCollectionModel as typeof SalePlotContentModel,
            bulkAdOps,
            bulkContentOps,
          );
        } else if (collectionName === 'rentplots') {
          processRentPlots(
            doc as IRentPlotsDoc,
            adCollectionModel as typeof RentAdModel,
            contentCollectionModel as typeof RentPlotContentModel,
            bulkAdOps,
            bulkContentOps,
          );
        }
      }

      if (bulkAdOps.length > 0) await adCollectionModel.bulkWrite(bulkAdOps);
      if (bulkContentOps.length > 0) await contentCollectionModel.bulkWrite(bulkContentOps);

      offset += batchSize;
    }

    debugLog(`Migration completed for ${collectionName}.`);
  }
}
