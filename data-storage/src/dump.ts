import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import { resolve } from 'path';

import { IAsyncArrayIterator } from './types';
import { createDumpFile, debugError, debugLog, getArrayIterator, makeDumpOfCollection } from './utils';


dotenv.config();

const DSN = `${process.env.MONGO_PROTOCOL}://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_INITDB_DATABASE}?authSource=admin${process.env.MONGO_RS ? '&replicaSet=' + process.env.MONGO_RS : ''}&ssl=false`;
const dumpFolder = './dist/dump';
let collections: string[];

try {
  collections = JSON.parse(process.env.MONGO_COLLECTIONS);
} catch (e) {
  debugError(e);

  collections = [];
}

async function makeDump(): Promise<void> {
  debugLog('Dump script started.');

  if (!collections.length) {
    debugLog('No collections names found. Script stopped.');

    return;
  }

  const collectionsArrayIterator: IAsyncArrayIterator<string> = getArrayIterator(collections);
  let totalDocumentsNumber = 0;

  for await (const collectionName of collectionsArrayIterator) {
    const fileAddress: string = await createDumpFile(resolve(process.cwd(), dumpFolder), collectionName);

    totalDocumentsNumber += await makeDumpOfCollection(fileAddress, collectionName, 100);
  }

  debugLog('Total documents:', totalDocumentsNumber);
}

mongoose.connect(DSN)
  .then(makeDump)
  .then(() => mongoose.connection.close())
  .then(() => process.exit(0))
  .catch((err) => {
    debugError(err);
    mongoose.connection.close();
  });
