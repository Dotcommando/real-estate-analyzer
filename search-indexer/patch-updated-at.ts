import './src/schemas/rent-apartments-flats.schema';
import './src/schemas/sale-apartments-flats.schema';
import './src/schemas/sale-houses.schema';
import './src/schemas/rent-houses.schema';

import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import * as path from 'path';

import { MINUTE_MS, SlugByCollection } from './src/constants';
import { ISearchIndexConfig } from './src/types';


const envPath = path.resolve(__dirname, '.env');

dotenv.config({ path: envPath });

let collections: string[];

try {
  if (process.env.MONGO_INITDB_DATABASE !== 'test') {
    throw new Error('Script \'patch-updated-at.ts\' is not allowed to work with non-test databases.');
  }

  const DSN = `${process.env.MONGO_PROTOCOL}://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_INITDB_DATABASE}?authSource=admin${process.env.MONGO_RS ? '&replicaSet=' + process.env.MONGO_RS : ''}&ssl=false`;
  const config: ISearchIndexConfig[] = JSON.parse(process.env.SEARCH_INDEX_CONFIG);

  collections = config.reduce((acc, val) => [ ...acc, ...val.collections ], []);

  mongoose.connect(DSN)
    .then(patchUpdatedAt)
    .then(() => process.exit(0));
} catch (err) {
  console.error(err);
  process.exit(1);
}

async function patchUpdatedAt(): Promise<void> {
  for (const collectionName of collections) {
    const modelName = SlugByCollection[collectionName];

    if (!modelName) {
      throw new Error(`Unknown collection: ${collectionName}`);
    }

    const model = mongoose.model(modelName);
    const docsCount = await model.countDocuments();
    const randomIndexes = Array.from({ length: 10 }, () => Math.floor(Math.random() * docsCount));
    const documents = await Promise.all(
      randomIndexes.map(index => model.findOne().skip(index).exec()),
    );

    console.log('');
    console.log(`'${collectionName}'`);

    for (const doc of documents) {
      if (doc) {
        doc.updated_at = new Date(Date.now() - MINUTE_MS * 0.5);
        await doc.save();

        console.log(`${doc._id}`);
      }
    }
  }
}
