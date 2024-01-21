import { Categories, OnlineViewing } from '../constants';
import { IRentApartmentsFlatsDoc, IRentHousesDoc, ISaleApartmentsFlatsDoc, ISaleHousesDoc } from '../schemas';
import { IRentResidential, ISaleResidential } from '../types';


export function adDocToSearchResultMapper<TObjectId>(
  doc: IRentApartmentsFlatsDoc | IRentHousesDoc | ISaleApartmentsFlatsDoc | ISaleHousesDoc,
  category: Categories,
): Omit<IRentResidential | ISaleResidential, 'priceDeviations'> & { _id: TObjectId } {
  const priceSqm = Math.round((doc.price / doc['property-area']) * 100) / 100;

  return {
    _id: doc._id,
    category,
    subcategory: doc.type,
    url: doc.url,
    title: doc.title,
    description: doc.description,
    publish_date: doc.publish_date,
    source: doc.source,
    city: doc.city,
    district: doc.district,
    price: doc.price,
    currency: doc.currency,
    ad_id: doc.ad_id,
    'online-viewing': doc['online-viewing'] ?? OnlineViewing.No,
    'postal-code': doc['postal-code'],
    'reference-number': doc['reference-number'],
    'registration-number': doc['registration-number'],
    'registration-block': doc['registration-block'],
    coords: doc.coords,
    updated_at: doc.updated_at,
    ad_last_updated: doc.ad_last_updated,
    'property-area': doc['property-area'],
    'property-area-unit': doc['property-area-unit'],
    ...(typeof doc['parking-places'] === 'number' && { 'parking-places': doc['parking-places'] }),
    furnishing: doc.furnishing,
    'air-conditioning': doc['air-conditioning'],
    bedrooms: doc.bedrooms,
    bathrooms: doc.bathrooms,
    ...(doc['floor'] && { floor: doc['floor'] }),
    ...(doc['pets'] && { pets: doc['pets'] }),
    condition: doc.condition,
    'energy-efficiency': doc['energy-efficiency'],
    'construction-year': doc['construction-year'],
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
    'price-sqm': isNaN(priceSqm) ? 0 : priceSqm,
    activeDays: doc.active_dates.length,
  };
}
