import { Model } from 'mongoose';

import {
  RentApartmentsFlatsModel,
  RentCommercialModel,
  RentHousesModel,
  RentPlotsModel,
  SaleApartmentsFlatsModel,
  SaleCommercialModel,
  SaleHousesModel,
  SalePlotsModel,
} from '../schemas';


export function getModelByCollectionName(collectionName: string): Model<unknown> {
  switch (collectionName) {
    case 'rentapartmentsflats':
      return RentApartmentsFlatsModel;

    case 'rentcommercial':
      return RentCommercialModel;

    case 'rentcommercials':
      return RentCommercialModel;

    case 'renthouses':
      return RentHousesModel;

    case 'rentplots':
      return RentPlotsModel;

    case 'saleapartmentsflats':
      return SaleApartmentsFlatsModel;

    case 'salecommercial':
      return SaleCommercialModel;

    case 'salecommercials':
      return SaleCommercialModel;

    case 'salehouses':
      return SaleHousesModel;

    case 'saleplots':
      return SalePlotsModel;

    default:
      throw new Error(`Model for ${collectionName} is not defined.`);
  }
}
