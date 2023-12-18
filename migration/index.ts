import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import * as path from 'path';

import { Source, StandardSet } from './constants';
import { IRentApartmentsFlatsDoc, ISaleApartmentsFlatsDoc } from './schemas';
import { IAsyncArrayIterator, IRentProperty, ISaleProperty } from './types';
import { debugError, debugLog, getArrayIterator, getModelByCollectionName } from './utils';


const envPath = path.resolve(__dirname, '.env');

dotenv.config({ path: envPath });

let collections: string[];

try {
  const DSN = `${process.env.MONGO_PROTOCOL}://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_INITDB_DATABASE}?authSource=admin${process.env.MONGO_RS ? '&replicaSet=' + process.env.MONGO_RS : ''}&ssl=false`;

  collections = JSON.parse(process.env.MONGO_COLLECTIONS);

  mongoose.connect(DSN)
    .then(migration)
    .then(() => process.exit(0));
} catch (err) {
  console.error(err);
  process.exit(1);
}

async function migration() {
  const collectionsArrayIterator: IAsyncArrayIterator<string> = getArrayIterator(collections);

  for await (const collectionName of collectionsArrayIterator) {
    const bulkOps = [];

    debugLog('');
    debugLog(`Collection: ${collectionName}`);

    const model = getModelByCollectionName(collectionName);

    if (!model) {
      debugError(`Cannot get model for collection ${collectionName}.`);

      continue;
    }

    const adsDocs = await model.find({})
      .lean() as Omit<(IRentProperty | ISaleProperty), '_id'>[];
    const ads: Omit<(IRentProperty | ISaleProperty), '_id'>[] = adsDocs.filter((doc) => !('version' in doc));
    const adsCount = ads.length;
    const totalDocsCount = adsDocs.length;
    const stats = {
      alarm: { before: 0, after: 0, stringValue: 'alarm' },
      attic: { before: 0, after: 0, stringValue: 'attic/loft' },
      balcony: { before: 0, after: 0, stringValue: 'balcony' },
      elevator: { before: 0, after: 0, stringValue: 'elevator' },
      fireplace: { before: 0, after: 0, stringValue: 'fireplace' },
      garden: { before: 0, after: 0, stringValue: 'garden' },
      playroom: { before: 0, after: 0, stringValue: 'playroom' },
      pool: { before: 0, after: 0, stringValue: 'pool' },
      storage: { before: 0, after: 0, stringValue: 'storageroom' },
      parking: { before: 0, after: 0, stringValue: 'parking' },
    };
    const newFields = Object.keys(stats);

    ads.forEach((ad: Omit<(IRentProperty | ISaleProperty), '_id'>) => {
      const updateDoc = { $set: {}, $unset: {}};

      if (collectionName !== 'rentplots' && collectionName !== 'saleplots') {
        if (ad.included && Array.isArray(ad.included)) {
          const included = ad.included.map(included => included
            .replace(/\s+/, '')
            .toLowerCase(),
          );

          for (const key of newFields) {
            const fieldIncluded = included.includes(stats[key].stringValue);

            if (fieldIncluded) {
              stats[key].before += 1;
            }

            if (key === 'pool') {
              if ((ad as unknown as (IRentApartmentsFlatsDoc | ISaleApartmentsFlatsDoc))['pool-type']) {
                updateDoc.$set[key] = ad['pool-type'];
                updateDoc.$unset['pool-type'] = '';
              } else {
                updateDoc.$set[key] = fieldIncluded
                  ? StandardSet.YES
                  : StandardSet.NO;
              }
            } else if (key === 'parking') {
              updateDoc.$set[key] = ad['parking'] !== StandardSet.NO && ad['parking'] !== undefined
                ? ad['parking']
                : fieldIncluded
                  ? StandardSet.YES
                  : StandardSet.NO;
            } else {
              updateDoc.$set[key] = fieldIncluded
                ? StandardSet.YES
                : StandardSet.NO;
            }
          }
        }
      } else {
        if (!ad['plot-area'] && typeof ad['price'] === 'number' && typeof ad['square-meter-price'] === 'number') {
          updateDoc.$set['plot-area'] = Math.round(ad['price'] / ad['square-meter-price']);
        }
      }

      if (ad['toilets'] > ad['bathrooms']) {
        updateDoc.$set['bathrooms'] = ad['toilets'];
      }

      if ('toilets' in ad) {
        updateDoc.$unset['toilets'] = '';
      }

      if (!ad['source']) {
        updateDoc.$set['source'] = ad['url'].startsWith('https://www.bazaraki.com')
          ? Source.BAZARAKI
          : ad['url'].startsWith('https://www.offer.com.cy')
            ? Source.OFFER
            : Source.UNKNOWN;
      }

      updateDoc.$set['ad_last_updated'] = ad['publish_date'] instanceof Date
        ? ad['publish_date']
        : new Date(ad['publish_date']);
      updateDoc.$unset['mode'] = '';
      updateDoc.$unset['square-meter-price'] = '';
      updateDoc.$set['version'] = '1.0.0';
      updateDoc.$set['updated_at'] = ad['active_dates']?.length
        ? ad['active_dates'].at(-1)
        : new Date();
      updateDoc.$unset['included'] = '';

      if (Object.keys(updateDoc.$set).length === 0) {
        delete updateDoc.$set;
      }

      if (Object.keys(updateDoc.$unset).length === 0) {
        delete updateDoc.$unset;
      }

      bulkOps.push({
        updateOne: {
          filter: { _id: ad['_id'] },
          update: updateDoc,
        },
      });
    });

    if (bulkOps.length > 0) {
      await model.bulkWrite(bulkOps);
    }

    debugLog(`Migration completed. ${adsCount} documents of ${totalDocsCount} updated.`);
  }
}
