import { Model } from 'mongoose';

import {
  RentApartmentsFlatsModel,
  RentHousesModel,
  SaleApartmentsFlatsModel,
  SaleHousesModel,
} from '../schemas';


export function getModelByCollectionName(collectionName: string): Model<unknown> {
  switch (collectionName) {
    case 'rentapartmentsflats':
      return RentApartmentsFlatsModel;

    case 'renthouses':
      return RentHousesModel;

    case 'saleapartmentsflats':
      return SaleApartmentsFlatsModel;

    case 'salehouses':
      return SaleHousesModel;

    default:
      throw new Error(`Model for ${collectionName} is not defined.`);
  }
}
