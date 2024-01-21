export const ModelCollectionRelationConst = {
  RentApartmentsFlats: 'rentapartmentsflats',
  RentCommercials: 'rentcommercials',
  RentHouses: 'renthouses',
  RentPlots: 'rentplots',
  SaleApartmentsFlats: 'saleapartmentsflats',
  SaleCommercials: 'salecommercials',
  SaleHouses: 'salehouses',
  SalePlots: 'saleplots',
};

export const SlugByCollection: {[key: string]: string} = Object
  .entries(ModelCollectionRelationConst)
  .reduce((acc, [ key, value ]: [ string, string ]) => {
    acc[value] = key;

    return acc;
  }, {});
