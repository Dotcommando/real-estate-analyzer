import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import { debugError, getArrayIterator, getModelByCollectionName } from './utils';
import { IAsyncArrayIterator } from './types';


dotenv.config({
  path: './.env',
});

interface IDistrictData {
  city: string;
  district: string;
  matches: number;
}

let collections: string[];
const cityDistrictMap = new Map<string, IDistrictData>();

try {
  const DSN = `${process.env.MONGO_PROTOCOL}://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_INITDB_DATABASE}?authSource=admin${process.env.MONGO_RS ? '&replicaSet=' + process.env.MONGO_RS : ''}&ssl=false`;

  collections = JSON.parse(process.env.MONGO_COLLECTIONS);

  mongoose.connect(DSN)
    .then(analyzeGeoData)
    .then(() => process.exit(0));
} catch (err) {
  console.error(err);
  process.exit(1);
}

async function analyzeGeoData() {
  const collectionsArrayIterator: IAsyncArrayIterator<string> = getArrayIterator(collections);

  for await (const collectionName of collectionsArrayIterator) {
    const model = getModelByCollectionName(collectionName);
    const ads = await model.find({});
    const adsCount = ads.length;

    for (let i = 0; i < adsCount; i++) {
      const hash = ads[i]['city'] + ads[i]['district'];

      if (cityDistrictMap.has(hash)) {
        const currentCityDistrict = cityDistrictMap.get(hash);

        currentCityDistrict.matches += 1;
      } else {
        cityDistrictMap.set(hash, {
          city: ads[i]['city'],
          district: ads[i]['district'],
          matches: 1,
        })
      }
    }

    if (!model) {
      debugError(`Cannot get model for collection ${collectionName}.`);

      return;
    }
  }

  const cityData: { [key: string]: { [key: string]: number } } = {};

  cityDistrictMap.forEach((data, hash) => {
    if (!cityData[data.city]) {
      cityData[data.city] = {};
    }
    cityData[data.city][data.district] = data.matches;
  });

  for (const city in cityData) {
    const sortedDistricts = Object.entries(cityData[city])
      .sort((a, b) => b[1] - a[1])
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    const cityFileName = path.join(__dirname, `${city} - frequency.json`);

    fs.writeFileSync(cityFileName, JSON.stringify(sortedDistricts, null, 2), 'utf8');
  }

  for (const city in cityData) {
    const sortedDistricts = Object.keys(cityData[city])
      .filter((district) => district !== 'undefined')
      .sort();

    const cityFileName = path.join(__dirname, `${city} - district arrays.json`);

    fs.writeFileSync(cityFileName, JSON.stringify(sortedDistricts, null, 2), 'utf8');
  }
}
