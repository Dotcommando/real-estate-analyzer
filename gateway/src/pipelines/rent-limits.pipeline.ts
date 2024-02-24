import { PipelineStage } from 'mongoose';


export const rentLimitsPipeline: PipelineStage[] = [
  {
    $facet: {
      limits: [
        {
          $group: {
            _id: null,
            source: { $addToSet: '$source' },
            'online-viewing': { $addToSet: '$online-viewing' },
            'postal-code': { $addToSet: '$postal-code' },
            condition: { $addToSet: '$condition' },
            'energy-efficiency': { $addToSet: '$energy-efficiency' },
            'construction-year': { $addToSet: '$construction-year' },
            floor: { $addToSet: '$floor' },
            parking: { $addToSet: '$parking' },
            'parking-places': { $addToSet: '$parking-places' },
            furnishing: { $addToSet: '$furnishing' },
            bedrooms: { $addToSet: '$bedrooms' },
            bathrooms: { $addToSet: '$bathrooms' },
            'air-conditioning': { $addToSet: '$air-conditioning' },
            pets: { $addToSet: '$pets' },
            alarm: { $addToSet: '$alarm' },
            attic: { $addToSet: '$attic' },
            balcony: { $addToSet: '$balcony' },
            elevator: { $addToSet: '$elevator' },
            fireplace: { $addToSet: '$fireplace' },
            garden: { $addToSet: '$garden' },
            playroom: { $addToSet: '$playroom' },
            pool: { $addToSet: '$pool' },
            storage: { $addToSet: '$storage' },
          },
        },
        {
          $project: {
            _id: 0,
            source: 1,
            'online-viewing': 1,
            'postal-code': 1,
            condition: 1,
            'energy-efficiency': 1,
            'construction-year': 1,
            floor: 1,
            parking: 1,
            'parking-places': 1,
            furnishing: 1,
            bedrooms: 1,
            bathrooms: 1,
            'air-conditioning': 1,
            pets: 1,
            alarm: 1,
            attic: 1,
            balcony: 1,
            elevator: 1,
            fireplace: 1,
            garden: 1,
            playroom: 1,
            pool: 1,
            storage: 1,
          },
        },
      ],
      cities: [
        {
          $group: {
            _id: { city: '$city' },
            districts: { $addToSet: '$district' },
          },
        },
        {
          $group: {
            _id: null,
            cities: {
              $push: {
                city: '$_id.city',
                districts: '$districts',
              },
            },
          },
        },
      ],
      categories: [
        {
          $match: {
            category: { $ne: null },
            subcategory: { $nin: [ null, 'undefined' ]},
          },
        },
        {
          $group: {
            _id: { category: '$category' },
            subcategories: { $addToSet: '$subcategory' },
          },
        },
        {
          $group: {
            _id: null,
            categories: {
              $push: {
                category: '$_id.category',
                subcategories: '$subcategories',
              },
            },
          },
        },
      ],
      ranges: [
        {
          $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
            minPropertyArea: { $min: '$property-area' },
            maxPropertyArea: { $max: '$property-area' },
            minPlotArea: { $min: '$plot-area' },
            maxPlotArea: { $max: '$plot-area' },
          },
        },
        {
          $project: {
            _id: 0,
            priceRange: { min: '$minPrice', max: '$maxPrice' },
            propertyAreaRange: { min: '$minPropertyArea', max: '$maxPropertyArea' },
            plotAreaRange: { min: '$minPlotArea', max: '$maxPlotArea' },
          },
        },
      ],
    },
  },
  {
    $project: {
      limits: { $arrayElemAt: [ '$limits', 0 ]},
      cities: '$cities.cities',
      categories: '$categories.categories',
      ranges: { $arrayElemAt: [ '$ranges', 0 ]},
    },
  },
];
