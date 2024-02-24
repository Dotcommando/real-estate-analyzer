export const SearchResultsModelCollectionRelationConst = {
  RentResidentials: 'sr_rentresidentials',
  SaleResidentials: 'sr_saleresidentials',
};

export const SearchResultsSlugByCollection: {[key: string]: string} = Object
  .entries(SearchResultsModelCollectionRelationConst)
  .reduce((acc, [ key, value ]: [ string, string ]) => {
    acc[value] = key;

    return acc;
  }, {});
