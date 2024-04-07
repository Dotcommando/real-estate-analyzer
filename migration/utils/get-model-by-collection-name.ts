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
import {
  RentAdModel,
  RentCommercialContentModel,
  RentPlotContentModel,
  RentResidentialContentModel,
  SaleAdModel,
  SaleCommercialContentModel,
  SalePlotContentModel,
  SaleResidentialContentModel,
} from '../schemas/new';


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

    case 'rentads':
      return RentAdModel;

    case 'saleads':
      return SaleAdModel;

    case 'rentcommercialcontents':
      return RentCommercialContentModel;

    case 'rentplotcontents':
      return RentPlotContentModel;

    case 'rentresidentialcontents':
      return RentResidentialContentModel;

    case 'salecommercialcontents':
      return SaleCommercialContentModel;

    case 'saleplotcontents':
      return SalePlotContentModel;

    case 'saleresidentialcontents':
      return SaleResidentialContentModel;

    default:
      throw new Error(`Model for ${collectionName} is not defined.`);
  }
}
