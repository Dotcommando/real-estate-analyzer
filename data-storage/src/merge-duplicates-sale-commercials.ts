import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';

import { SaleCommercialsModel } from './schemas';
import { debugError } from './utils';


dotenv.config();

const DSN = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@localhost:${process.env.MONGO_PORT}/${process.env.MONGO_INITDB_DATABASE}?authSource=admin&replicaSet=rs0&ssl=false`;

async function mergeDuplicatesSaleCommercials() {
  await SaleCommercialsModel.aggregate([
    {
      $sort: { _id: 1 },
    },
    {
      $group: {
        _id: '$ad_id',
        doc: { $first: '$$ROOT' },  // Берём первый документ из группы
        active_dates: { $addToSet: '$active_dates' },  // Объединяем все active_dates в один массив
      },
    },
    {
      $project: {
        _id: 0,
        'doc._id': 1,
        'doc.url': 1,
        'doc.title': 1,
        'doc.description': 1,
        'doc.publish_date': 1,
        'doc.city': 1,
        'doc.district': 1,
        'doc.price': 1,
        'doc.currency': 1,
        'doc.ad_id': 1,
        'doc.online-viewing': 1,
        'doc.postal-code': 1,
        'doc.reference-number': 1,
        'doc.registration-number': 1,
        'doc.registration-block': 1,
        'doc.square-meter-price': 1,
        'doc.condition': 1,
        'doc.energy-efficiency': 1,
        'doc.included': 1,
        'doc.construction-year': 1,
        'doc.type': 1,
        'doc.area': 1,
        'doc.area-unit': 1,
        'doc.plot-area': 1,
        'doc.plot-area-unit': 1,
        'doc.active_dates': {
          $reduce: {
            input: '$active_dates',
            initialValue: [],
            in: { $concatArrays: [ '$$value', '$$this' ]},
          },
        },
        'doc.mode': 1,
      },
    },
    {
      $replaceRoot: { newRoot: '$doc' },
    },
    {
      $out: 'temp__salecommercials',
    },
  ]);
}

try {
  mongoose.connect(DSN)
    .then(mergeDuplicatesSaleCommercials)
    .then(() => process.exit(0));
} catch (err) {
  debugError(err);
}
