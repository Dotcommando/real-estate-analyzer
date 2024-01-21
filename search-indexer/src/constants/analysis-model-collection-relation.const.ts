export const CityAnalysisModelCollectionRelationConst = {
  CityStatsRentFlats: 'rentapartmentsflats_analysis',
  CityStatsRentHouses: 'renthouses_analysis',
  CityStatsSaleFlats: 'saleapartmentsflats_analysis',
  CityStatsSaleHouses: 'salehouses_analysis',
};

export const DistrictAnalysisModelCollectionRelationConst = {
  DistrictStatsRentFlats: 'rentapartmentsflats_analysis',
  DistrictStatsRentHouses: 'renthouses_analysis',
  DistrictStatsSaleFlats: 'saleapartmentsflats_analysis',
  DistrictStatsSaleHouses: 'salehouses_analysis',
};

export const CitySlugByCollection: {[key: string]: string} = Object
  .entries(CityAnalysisModelCollectionRelationConst)
  .reduce((acc, [ key, value ]: [ string, string ]) => {
    acc[value] = key;

    return acc;
  }, {});

export const DistrictSlugByCollection: {[key: string]: string} = Object
  .entries(DistrictAnalysisModelCollectionRelationConst)
  .reduce((acc, [ key, value ]: [ string, string ]) => {
    acc[value] = key;

    return acc;
  }, {});
