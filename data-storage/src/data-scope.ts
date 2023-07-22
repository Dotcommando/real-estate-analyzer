import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import { resolve } from 'path';

import { IAsyncArrayIterator } from './types';
import {
  createAnalysisFile,
  debugError,
  debugLog,
  getArrayIterator,
  getModelByCollectionName,
  writeFile,
} from './utils';


dotenv.config();

const DSN = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@localhost:${process.env.MONGO_PORT}/${process.env.MONGO_INITDB_DATABASE}?authSource=admin${process.env.MONGO_RS ? '&replicaSet=' + process.env.MONGO_RS : ''}&ssl=false`;
const analysisFolder = './dist/analysis';

let collections: string[];

try {
  collections = JSON.parse(process.env.MONGO_COLLECTIONS_FOR_ANALYSIS);
} catch (e) {
  debugError(e);

  collections = [];
}

const fieldsToGetUniqueValues = [
  'type',
  'floor',
  'parking',
  'furnishing',
  'bedrooms',
  'bathrooms',
  'air-conditioning',
  'pets',
  'condition',
  'energy-efficiency',
  'construction-year',
  'online-viewing',
  'postal-code',
];

async function dataScope(): Promise<void> {
  if (!collections.length) {
    debugLog('No collections names found. Script stopped.');

    return;
  }

  const collectionsArrayIterator: IAsyncArrayIterator<string> = getArrayIterator(collections);
  const result = {};

  for await (const collectionName of collectionsArrayIterator) {
    const model = getModelByCollectionName(collectionName);

    if (!model) {
      debugError(`Cannot get model for collection ${collectionName}.`);

      return;
    }

    debugLog(' ');
    debugLog(' ');
    debugLog(' ');
    debugLog('Collection:', collectionName);

    result[collectionName] = {};

    try {
      const cityDistricts = await model.aggregate([
        {
          $group: {
            _id: {
              city: '$city',
              district: '$district',
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: '$_id.city',
            districts: {
              $push: {
                district: '$_id.district',
                count: '$count',
              },
            },
          },
        },
      ]).exec();

      result[collectionName]['address'] = {};

      for (const cityDistrict of cityDistricts) {
        debugLog(' ');
        debugLog(`    City: ${cityDistrict._id}`);

        result[collectionName]['address'][cityDistrict._id] = cityDistrict.districts;

        for (const district of cityDistrict.districts) {
          debugLog(`        ${district.district}: ${district.count}`);
        }
      }
    } catch (err) {
      debugError(`Error occurred while grouping by city and getting districts: ${err.message}`);
    }

    for (const field of fieldsToGetUniqueValues) {
      try {
        const uniqueValues = await model.distinct(field).exec();

        if (uniqueValues.length) {
          debugLog(' ');
          debugLog(`Field "${ field }":`);
          debugLog(uniqueValues);

          result[collectionName][field] = uniqueValues;
        }
      } catch (err) {
        debugError(`Error occurred while getting unique values for field "${field}": ${err.message}`);
      }
    }
  }

  const fileAddress: string = await createAnalysisFile(resolve(process.cwd(), analysisFolder), 'stat');

  await writeFile(fileAddress, result);
}

mongoose.connect(DSN)
  .then(dataScope)
  .then(() => mongoose.connection.close())
  .then(() => process.exit(0))
  .catch((err) => {
    debugError(err);
    mongoose.connection.close();
  });
