import { AnyBulkWriteOperation, ObjectId } from 'mongodb';

import { Categories } from '../constants';
import { constructionYear, floor, postalCodeMapper, priceSqm, registrationNumber, subcategory } from '../mappers';
import { IRentApartmentsFlatsDoc, IRentHousesDoc } from '../schemas';
import { IAd, IResidentialContent } from '../types/new';
import { debugError } from '../utils';


export function processRentResidentials(
  doc: IRentApartmentsFlatsDoc | IRentHousesDoc,
  sourceCollection: string,
  bulkAdOps: Array<AnyBulkWriteOperation<IAd<ObjectId>>>,
  bulkContentOps: Array<AnyBulkWriteOperation<IResidentialContent<ObjectId>>>,
): void {
  try {
    const newContentDoc: IResidentialContent<ObjectId> = {
      _id: new ObjectId(),
      ad: new ObjectId(doc._id),
      title: doc.title,
      description: doc.description,
      publish_date: doc.publish_date as Date,
      address: doc.city + `${doc.district ? ', ' + doc.district : ''}`,
      city: doc.city,
      district: doc.district,
      price: doc.price,
      currency: doc.currency,
      'postal-code': postalCodeMapper(doc['postal-code']),
      'registration-number': registrationNumber(doc['registration-number']),
      'registration-block': registrationNumber(doc['registration-block']),
      'energy-efficiency': doc['energy-efficiency'],
      'construction-year': constructionYear(doc['construction-year']),
      floor: floor(doc['floor']),
      'parking-places': doc['parking-places'],
      'area': doc['property-area'],
      'area-unit': 'm²',
      'plot-area': doc['plot-area'],
      'plot-area-unit': 'm²',
      furnishing: doc.furnishing,
      bedrooms: doc.bedrooms,
      bathrooms: doc.bathrooms,
      'air-conditioning': doc['air-conditioning'],
      pets: Boolean(doc.pets) ? doc.pets : null,
      alarm: doc.alarm,
      attic: doc.attic,
      balcony: doc.balcony,
      elevator: doc.elevator,
      fireplace: doc.fireplace,
      garden: doc.garden,
      playroom: doc.playroom,
      pool: doc.pool,
      storage: doc.storage,
      parking: doc.parking,
      coords: doc.coords,
      active_dates: doc.active_dates,
      'price-sqm': priceSqm(doc.price, doc['property-area']),
      photo: [],
      updated_at: doc.updated_at,
      ad_last_updated: doc.ad_last_updated,
      version: '2.0.0',
    };

    const newAdDoc: IAd<ObjectId> = {
      _id: new ObjectId(doc._id),
      ad_id: doc.ad_id,
      url: doc.url,
      source: doc.source,
      ad_last_updated: doc.ad_last_updated,
      updated_at: doc.updated_at,
      category: sourceCollection === 'rentapartmentsflats'
        ? Categories.Apartments
        : Categories.Houses,
      subcategory: subcategory(doc.type),
      content: [ newContentDoc._id ],
      version: '2.0.0',
    };

    bulkContentOps.push({
      updateOne: {
        filter: { _id: newContentDoc._id },
        update: { $set: newContentDoc },
        upsert: true,
      },
    });

    bulkAdOps.push({
      updateOne: {
        filter: { _id: newAdDoc._id },
        update: { $set: newAdDoc },
        upsert: true,
      },
    });
  } catch (e) {
    debugError(`An error occurred: ${e}`);
  }
}
