import { Model } from 'mongoose';

import {
  RentApartmentsFlatsModel,
  RentCommercialsModel,
  RentHousesModel,
  RentPlotsModel,
  SaleApartmentsFlatsModel,
  SaleCommercialsModel,
  SaleHousesModel,
  SalePlotsModel,
} from '../schemas';


export function getModelByCollectionName(collectionName: string): Model<unknown> {
  switch (collectionName) {
    case 'rentapartmentsflats':
      return RentApartmentsFlatsModel;

    case 'rentcommercial':
      return RentCommercialsModel;

    case 'rentcommercials':
      return RentCommercialsModel;

    case 'renthouses':
      return RentHousesModel;

    case 'rentplots':
      return RentPlotsModel;

    case 'saleapartmentsflats':
      return SaleApartmentsFlatsModel;

    case 'salecommercial':
      return SaleCommercialsModel;

    case 'salecommercials':
      return SaleCommercialsModel;

    case 'salehouses':
      return SaleHousesModel;

    case 'saleplots':
      return SalePlotsModel;

    default:
      throw new Error(`Model for ${collectionName} is not defined.`);
  }
}
