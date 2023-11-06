import { ResourceLanguage } from 'i18next';

export const EN_I18N: ResourceLanguage = {
  translation: {
    menu: {
      home: 'Home',
      bestPrices: 'Best prices',
      statistic: 'Statistic by cities',
    },
    statistic: {
      title: 'Statistic',
    },
    bestPrices: {
      // TODO: use vars and change country
      title: 'Best prices in Cyprus',
      allCities: 'All cities',
      bathrooms: 'Count bathroom:',
      bedrooms: 'Count bedroom:',
      square: 'Square:',
      city: 'Select city',
      district: 'Select district',
      energy: 'Energy efficiency',
      furniture: 'Furniture',
      expandDescription: 'Expand description',
      hideDescription: 'Hide description',
      expandDetails: 'More',
      hideDetails: 'Hide',
      firePlace: 'Fireplace',
      balcony: 'Balcony',
      pool: 'Pool',
      storageRoom: 'Storage room',
      garden: 'Garden',
      currencyEur: 'Currency eur',
      open: 'Open',
      price: {
        title:
          'This section describes price detail. How it compares with another ads',
        description:
          'We compare all ads and show, is this price lower/higher of market',
        redOne: 'Red one ',
        redOneDescription: 'means that price higher of median price of market',
        orangeOne: 'Orange one ',
        orangeOneDescription: 'a bit higher of median price',
        greenOne: 'Green one ',
        greenOneDescription: "lower than median price, it's what you need",
        currentMeanPrice:
          'Current mean price for city <strong>{{city}}</strong> is <strong>{{price}}</strong>',
        currentMedianPrice:
          'Current median price for city <strong>{{city}}</strong> is <strong>{{price}}</strong>',
      },
      loadMore: 'Load more',
      apartShort: 'Apart.',
      links: {
        hideAd: 'Hide this ad',
        addToFavorites: 'Add to favorites',
        showSource: 'Show source',
        moreData: 'More data',
      },
    },
    bookmark: {
      avg: 'Avg',
      median: 'Median',
    },
    adsType: {
      rentFlats: 'Flats for rent',
      rentHouses: 'Houses for rent',
      saleFlats: 'Flats for sale',
      saleHouses: 'Houses for sale',
      rent: 'Rent',
      sale: 'Sale',
      type: 'Ads type',
    },
    registration: {
      title: 'Registration',
    },
    indicator: {
      bedroom: 'Bedrooms',
      bathroom: 'Bathrooms',
    },
    common: {
      notFound: 'Not found results by this query',
    },
  },
};
