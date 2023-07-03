export const Categories = {
  RentApartmentsFlats: '/real-estate-to-rent/apartments-flats/',
  RentCommercials: '/real-estate-to-rent/commercial-property/',
  RentHouses: '/real-estate-to-rent/houses/',
  RentPlots: '/real-estate-to-rent/plots-of-land/',
  SaleApartmentsFlats: '/real-estate-for-sale/apartments-flats/',
  SaleCommercials: '/real-estate-for-sale/commercial-property/',
  SaleHouses: '/real-estate-for-sale/houses/',
  SalePlots: '/real-estate-for-sale/plots-of-land/',
};

export const SlugByCategory: {[key: string]: string} = Object
  .entries(Categories)
  .reduce((acc, [ key, value ]: [ string, string ]) => {
    acc[value] = key;

    return acc;
  }, {});
