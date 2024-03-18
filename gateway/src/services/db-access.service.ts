import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, PipelineStage } from 'mongoose';
import { IRentApartmentsFlatsDoc, IRentHousesDoc, ISaleApartmentsFlatsDoc, ISaleHousesDoc } from 'src/schemas';
import { IGetDistrictsResult } from 'src/types/get-districts.interface';
import { getLastDate, persistPipeline } from 'src/utils';

import {
  AdsEnum,
  AdsEnumArray,
  AnalysisType,
  AnalysisTypeArray,
  EMPTY_SEARCH_RESULT,
  NESTED_RANGE_FIELDS,
  NoStatisticsDataReason,
  RANGE_FIELDS,
} from '../constants';
import {
  activeDatesMapper,
  analysisMapper,
  cityReportMapper,
  districtReportMapper,
  toRentResidentialIdMapper,
  toSaleResidentialIdMapper,
} from '../mappers';
import { rentLimitsPipeline, saleLimitsPipeline } from '../pipelines';
import {
  AG_MayBeArray,
  AG_MayBeRange,
  IAdsParams,
  IAdsResult,
  IAnalysisParams,
  IAnalysisResult,
  ICityStats,
  ICityStatsDoc,
  IDistrictStats,
  IDistrictStatsDoc,
  IGetDistrictsParams,
  IGetRentResidentialQuery,
  IGetRentResidentialSort,
  IGetSaleResidentialQuery,
  IGetSaleResidentialSort,
  IRentLimits,
  IRentResidential,
  IRentResidentialId,
  ISaleLimits,
  ISaleResidential,
  ISaleResidentialId,
} from '../types';


const specialFields = [ 'priceDeviations', 'bedrooms', 'bathrooms' ];
const simpleTypes = [ 'boolean', 'number', 'string' ];
const rangeFields = [ ...RANGE_FIELDS, ...NESTED_RANGE_FIELDS ];

@Injectable()
export class DbAccessService {
  constructor(
    @InjectModel('CityStatsRentFlats') private readonly cityStatsRentFlatsModel: Model<ICityStatsDoc>,
    @InjectModel('CityStatsRentHouses') private readonly cityStatsRentHousesModel: Model<ICityStatsDoc>,
    @InjectModel('CityStatsSaleFlats') private readonly cityStatsSaleFlatsModel: Model<ICityStatsDoc>,
    @InjectModel('CityStatsSaleHouses') private readonly cityStatsSaleHousesModel: Model<ICityStatsDoc>,
    @InjectModel('DistrictStatsRentFlats') private readonly districtStatsRentFlatsModel: Model<IDistrictStatsDoc>,
    @InjectModel('DistrictStatsRentHouses') private readonly districtStatsRentHousesModel: Model<IDistrictStatsDoc>,
    @InjectModel('DistrictStatsSaleFlats') private readonly districtStatsSaleFlatsModel: Model<IDistrictStatsDoc>,
    @InjectModel('DistrictStatsSaleHouses') private readonly districtStatsSaleHousesModel: Model<IDistrictStatsDoc>,
    @InjectModel('SaleHouses') private readonly saleHousesModel: Model<ISaleHousesDoc>,
    @InjectModel('SaleFlats') private readonly saleFlatsModel: Model<ISaleApartmentsFlatsDoc>,
    @InjectModel('RentFlats') private readonly rentFlatsModel: Model<IRentApartmentsFlatsDoc>,
    @InjectModel('RentHouses') private readonly rentHousesModel: Model<IRentHousesDoc>,
    @InjectModel('RentResidentials') private readonly rentResidentialsModel: Model<IRentResidential>,
    @InjectModel('SaleResidentials') private readonly saleResidentialsModel: Model<ISaleResidential>,
  ) {
  }

  private getStatsModel(analysisType: AnalysisType, ads: AdsEnum): Model<ICityStatsDoc | IDistrictStatsDoc> {
    if (!AnalysisTypeArray.includes(analysisType)) {
      throw new Error(`Analysis type "${typeof analysisType === 'object' && analysisType !== null ? JSON.stringify(analysisType) : String(analysisType)}" is out of available values: ${AnalysisTypeArray.join(', ')}.`);
    }

    if (!AdsEnumArray.includes(ads)) {
      throw new Error(`Variable "ads", which is equal "${typeof ads === 'object' && ads !== null ? JSON.stringify(ads) : String(ads)}", is out of available values: ${AdsEnumArray.join(', ')}.`);
    }

    switch (ads) {
      case AdsEnum.RentFlats:
        return analysisType === AnalysisType.CITY_AVG_MEAN
          ? this.cityStatsRentFlatsModel
          : this.districtStatsRentFlatsModel;

      case AdsEnum.RentHouses:
        return analysisType === AnalysisType.CITY_AVG_MEAN
          ? this.cityStatsRentHousesModel
          : this.districtStatsRentHousesModel;

      case AdsEnum.SaleFlats:
        return analysisType === AnalysisType.CITY_AVG_MEAN
          ? this.cityStatsSaleFlatsModel
          : this.districtStatsSaleFlatsModel;

      case AdsEnum.SaleHouses:
        return analysisType === AnalysisType.CITY_AVG_MEAN
          ? this.cityStatsSaleHousesModel
          : this.districtStatsSaleHousesModel;
    }
  }

  private getAdsModel(ads: AdsEnum): Model<ISaleHousesDoc | ISaleApartmentsFlatsDoc | IRentApartmentsFlatsDoc | IRentHousesDoc> {
    if (!AdsEnumArray.includes(ads)) {
      throw new Error(`Variable "ads", which is equal "${typeof ads === 'object' && ads !== null ? JSON.stringify(ads) : String(ads)}", is out of available values: ${AdsEnumArray.join(', ')}.`);
    }

    switch (ads) {
      case AdsEnum.RentFlats:
        return this.rentFlatsModel;

      case AdsEnum.RentHouses:
        return this.rentHousesModel;

      case AdsEnum.SaleFlats:
        return this.saleFlatsModel;

      case AdsEnum.SaleHouses:
        return this.saleHousesModel;
    }
  }

  private async getCityAnalysis(params: IAnalysisParams): Promise<IAnalysisResult<ICityStats>[]> {
    const model = this.getStatsModel(params.analysisType, params.ads);
    const filter = {
      $and: [
        {
          start_date: { $gte: params.startDate },
        },
        {
          end_date: { $lte: params.endDate },
        },
        {
          analysis_period: params.analysisPeriod,
        },
        {
          analysis_type: AnalysisType.CITY_AVG_MEAN,
        },
        ...(params.analysisVersion
          ? [ { analysis_version: params.analysisVersion } ]
          : [ { analysis_version: '1.0.0' } ]
        ),
      ],
    };

    const docs = await model.find(filter) as IAnalysisResult<ICityStatsDoc>[];

    return analysisMapper(docs, cityReportMapper);
  }

  private async getDistrictAnalysis(params: IAnalysisParams): Promise<IAnalysisResult<IDistrictStats>[]> {
    const model = this.getStatsModel(params.analysisType, params.ads);
    const filter = {
      $and: [
        {
          start_date: { $gte: params.startDate },
        },
        {
          end_date: { $lte: params.endDate },
        },
        {
          analysis_period: params.analysisPeriod,
        },
        {
          analysis_type: AnalysisType.DISTRICT_AVG_MEAN,
        },
        ...(params.analysisVersion
          ? [ { analysis_version: params.analysisVersion } ]
          : [ { analysis_version: '1.0.0' } ]
        ),
      ],
    };

    const docs = await model.find(filter) as IAnalysisResult<IDistrictStatsDoc>[];

    return analysisMapper(docs, districtReportMapper);
  }

  public async getAnalysis(params: IAnalysisParams): Promise<IAnalysisResult<ICityStats>[] | IAnalysisResult<IDistrictStats>[]> {
    return params.analysisType === AnalysisType.CITY_AVG_MEAN
      ? await this.getCityAnalysis(params)
      : await this.getDistrictAnalysis(params);
  }

  public async getAds(params: IAdsParams): Promise<{ ads: IAdsResult; total: number }> {
    const model = this.getAdsModel(params.collection as AdsEnum);

    const filter = {
      $or: [
        {
          publish_date: { $gte: params.startDate, $lte: params.endDate },
        },
        {
          active_dates: { $elemMatch: {
            $gte: params.startDate,
            $lte: params.endDate,
          }},
        },
      ],
    };

    if (params.city) {
      filter['city'] = params.city;
    }
    if (params.district) {
      filter['district'] = params.district;
    }

    const ads = await model.aggregate([
      { $match: filter },
      { $skip: params.offset },
      { $limit: params.limit },
    ]);

    return {
      ads: activeDatesMapper(ads, getLastDate),
      total: await model.countDocuments(filter),
    };
  }

  public async getDistrict(
    params: IGetDistrictsParams,
  ): Promise<IGetDistrictsResult[]> {
    const filters = {
      analysis_type: 'district_avg_mean',
      analysis_period: 'monthly_total',
    };

    return this.districtStatsRentFlatsModel.aggregate([
      { $match: filters },
      { $sort: { end_date: -1 }},
      { $limit: 1 },
      { $unwind: '$data' },
      ...(params.city
        ? [ { $match: { 'data.city': new RegExp([ '^', params.city ].join(''), 'i') }} ]
        : []
      ),
      {
        $group: {
          _id: null,
          data: { $push: '$data' },
        },
      },
      { $unwind: '$data' },
      {
        $replaceRoot: {
          newRoot: '$data',
        },
      },
      {
        $group: {
          _id: '$city',
          city: { $first: '$city' },
          districts: { $push: '$district' },
        },
      },
      { $project: { _id: 0 }},
    ]);
  }

  private processPriceDeviationsFilter(
    priceDeviations: IGetRentResidentialQuery['priceDeviations'] | IGetSaleResidentialQuery['priceDeviations'],
  ): { [key: string]: AG_MayBeRange<number> | AG_MayBeArray<NoStatisticsDataReason> } {
    const processedDeviations: any = {};

    for (const analysisType in priceDeviations) {
      for (const analysisPeriod in priceDeviations[analysisType]) {
        for (const statKey in priceDeviations[analysisType][analysisPeriod]) {
          const path = `priceDeviations.${analysisType}.${analysisPeriod}.${statKey}`;

          processedDeviations[path] = priceDeviations[analysisType][analysisPeriod][statKey];
        }
      }
    }

    return processedDeviations;
  }

  private processNestedFields(
    filter: IGetRentResidentialQuery | IGetSaleResidentialQuery,
    field: string,
    exceptions: string[],
  ): { [key: string]: unknown } {
    if (!(field in filter)) {
      return {} as { [key: string]: unknown };
    }

    const result = {};
    const nestedObject = filter[field];

    const processNestedObject = (nestedObj: any, basePath: string): void => {
      Object.entries(nestedObj).forEach(([ key, value ]) => {
        const isException = exceptions.some(exception => key.includes(`[${exception}]`));
        const currentPath = isException ? basePath : `${basePath}.${key}`.trim();

        if (!isException && typeof value === 'object' && !Array.isArray(value) && value !== null) {
          processNestedObject(value, currentPath);
        } else {
          if (isException && typeof result[basePath] !== 'object') {
            result[basePath] = {};
          }

          const rangeKey = isException ? `$${key.split('[$')[1].slice(0, -1)}` : null;

          if (rangeKey) {
            result[basePath][rangeKey] = value;
          } else if (Array.isArray(value)) {
            result[currentPath] = { $in: value };
          } else {
            result[currentPath] = value;
          }
        }
      });
    };

    processNestedObject(nestedObject, field);

    Object.entries(result).forEach(([ key, value ]) => {
      const hasOperator = exceptions.some((exception) => key.includes(exception));

      if (hasOperator) {
        const operatorIndex = exceptions.reduce((acc, exception) => {
          const index = key.indexOf(exception);

          return index !== -1 && (acc === -1 || index < acc) ? index : acc;
        }, -1);

        if (operatorIndex !== -1) {
          const basePath = key.substring(0, operatorIndex - 1);
          const operator = key.substring(operatorIndex);

          if (typeof result[basePath] !== 'object' || result[basePath] === null) {
            result[basePath] = {};
          }

          result[basePath][operator] = value;

          delete result[key];
        }
      }
    });

    return result;
  }

  private getResidentialPipelineBuilder(
    filter: IGetRentResidentialQuery | IGetSaleResidentialQuery,
    sort: IGetRentResidentialSort | IGetSaleResidentialSort,
    offset: number = 0,
    limit: number = 25,
  ): PipelineStage[] {
    const $match = { $and: []};
    const dateFields = [ 'publish_date', 'ad_last_updated', 'updated_at' ];
    const nestedConditions = this.processNestedFields(filter, 'priceDeviations', [ '$lte', '$lt', '$eq', '$gt', '$gte' ]);

    // persistPipeline(nestedConditions);

    Object.entries(nestedConditions).forEach(([ key, value ]) => {
      $match.$and.push({ [key]: value });
    });

    const addOrConditionsForField = (field: string, values: string[]) => {
      const conditions = [];

      values
        .filter((val => /\d{1,2}\+?/.test(val)))
        .forEach((value: string) => {
          if (value.endsWith('+')) {
            const number = parseInt(value.slice(0, -1), 10);

            conditions.push({ [field]: { $gte: number }});
          } else {
            const number = parseInt(value, 10);

            if (!isNaN(number)) {
              conditions.push({ [field]: number });
            }
          }
        });

      if (conditions.length > 0) {
        $match.$and.push({ $or: conditions });
      }
    };

    [ 'bedrooms', 'bathrooms' ].forEach(field => {
      if (filter[field]) {
        addOrConditionsForField(field, filter[field]);
      }
    });

    for (const key in filter) {
      if (specialFields.includes(key)) {
        continue;
      }

      if (rangeFields.includes(key) && filter[key]) {
        const rangeConditions = {};

        for (const rangeKey in filter[key]) {
          const value = filter[key][rangeKey];

          if (!value) continue;

          const mongoRangeKey = `$${rangeKey.replace(/\$/g, '')}`;

          rangeConditions[mongoRangeKey] = dateFields.includes(key) ? new Date(value) : value;
        }

        if (Object.keys(rangeConditions).length > 0) {
          $match.$and.push({ [key]: rangeConditions });
        }
      } else if (Array.isArray(filter[key])) {
        $match.$and.push({ [key]: { $in: filter[key] }});
      } else if (simpleTypes.includes(typeof filter[key])) {
        $match.$and.push({ [key]: filter[key] });
      }
    }

    const $sort = {};

    for (const sortKey in sort) {
      $sort[sortKey] = sort[sortKey];
    }

    const matchStage = $match.$and.length > 0 ? $match : {};

    return [
      { $match: matchStage },
      { $sort },
      {
        $facet: {
          stage1: [ { $group: { _id: null, total: { $sum: 1 }}} ],
          stage2: [ { $skip: offset }, { $limit: limit } ],
        },
      },
      { $unwind: '$stage1' },
      {
        $project: {
          total: '$stage1.total',
          data: '$stage2',
        },
      },
    ];
  }

  public async getRentResidential(
    filter: IGetRentResidentialQuery,
    sort: IGetRentResidentialSort,
    offset: number = 0,
    limit: number = 25,
  ): Promise<{ data: IRentResidentialId[]; total: number }> {
    // persistPipeline(this.getResidentialPipelineBuilder(filter, sort, offset, limit));

    const result = (await this.rentResidentialsModel
      .aggregate(this.getResidentialPipelineBuilder(filter, sort, offset, limit))
      .exec()
    )?.[0] ?? EMPTY_SEARCH_RESULT;

    return {
      total: result.total,
      data: result.data.map(toRentResidentialIdMapper),
    };
  }

  public async getSaleResidential(
    filter: IGetSaleResidentialQuery,
    sort: IGetSaleResidentialSort,
    offset: number = 0,
    limit: number = 25,
  ): Promise<{ data: ISaleResidentialId[]; total: number }> {
    // persistPipeline(this.getResidentialPipelineBuilder(filter, sort, offset, limit));

    const result = (await this.saleResidentialsModel
      .aggregate(this.getResidentialPipelineBuilder(filter, sort, offset, limit))
      .exec()
    )?.[0] ?? EMPTY_SEARCH_RESULT;

    return {
      total: result.total,
      data: result.data.map(toSaleResidentialIdMapper),
    };
  }

  public async getRentLimits(): Promise<IRentLimits> {
    const result = await this.rentResidentialsModel
      .aggregate(rentLimitsPipeline)
      .exec();
    const data = result?.[0] ?? {};

    if (data.cities && Array.isArray(data.cities) && data.cities.length > 0) {
      data.cities = data.cities[0];
    }

    if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
      data.categories = data.categories[0];
    }

    return data;
  }

  public async getSaleLimits(): Promise<ISaleLimits> {
    const result = await this.saleResidentialsModel
      .aggregate(saleLimitsPipeline)
      .exec();
    const data = result?.[0] ?? {};

    if (data.cities && Array.isArray(data.cities) && data.cities.length > 0) {
      data.cities = data.cities[0];
    }

    if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
      data.categories = data.categories[0];
    }

    return data;
  }
}
