import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, PipelineStage } from 'mongoose';
import { writeFileSync } from 'node:fs';
import { IRentApartmentsFlatsDoc, IRentHousesDoc, ISaleApartmentsFlatsDoc, ISaleHousesDoc } from 'src/schemas';
import { IGetDistrictsResult } from 'src/types/get-districts.interface';
import { getLastDate } from 'src/utils';

import {
  AdsEnum,
  AdsEnumArray,
  AnalysisType,
  AnalysisTypeArray,
  EMPTY_SEARCH_RESULT,
  NoStatisticsDataReason,
} from '../constants';
import {
  activeDatesMapper,
  analysisMapper,
  cityReportMapper,
  districtReportMapper,
  toRentResidentialIdMapper,
  toSaleResidentialIdMapper,
} from '../mappers';
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
  IRentResidential,
  IRentResidentialId,
  ISaleResidential,
  ISaleResidentialId,
} from '../types';


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

    return await this.districtStatsRentFlatsModel.aggregate([
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

  private processPriceDeviationsSort(
    priceDeviationsSort: IGetRentResidentialSort['priceDeviations'] | IGetSaleResidentialSort['priceDeviations'],
  ): { [key: string]: 1 | -1 } {
    const processedSort: { [key: string]: 1 | -1 } = {};

    for (const analysisType in priceDeviationsSort) {
      for (const analysisPeriod in priceDeviationsSort[analysisType]) {
        for (const statKey in priceDeviationsSort[analysisType][analysisPeriod]) {
          const path = `priceDeviations.${analysisType}.${analysisPeriod}.${statKey}`;

          processedSort[path] = priceDeviationsSort[analysisType][analysisPeriod][statKey];
        }
      }
    }

    return processedSort;
  }

  private getResidentialPipelineBuilder(
    filter: IGetRentResidentialQuery | IGetSaleResidentialQuery,
    sort: IGetRentResidentialSort | IGetSaleResidentialSort,
    offset: number = 0,
    limit: number = 25,
  ): PipelineStage[] {
    const $matchConditions = [];

    for (const key in filter) {
      if (key !== 'priceDeviations') {
        if (Array.isArray(filter[key])) {
          $matchConditions.push({ [key]: { $in: filter[key] }});
        } else {
          $matchConditions.push({ [key]: filter[key] });
        }
      } else {
        const processedDeviations = this.processPriceDeviationsFilter(filter[key]);

        for (const deviationKey in processedDeviations) {
          $matchConditions.push({ [deviationKey]: processedDeviations[deviationKey] });
        }
      }
    }

    const $sort = {};

    for (const sortKey in sort) {
      if (sortKey !== 'priceDeviations') {
        $sort[sortKey] = sort[sortKey];
      } else {
        const processedDeviations = this.processPriceDeviationsSort(sort[sortKey]);

        for (const key in processedDeviations) {
          $sort[key] = processedDeviations[key];
        }
      }
    }

    const pipeline: PipelineStage[] = [];

    if ($matchConditions.length > 0) {
      pipeline.push({ $match: { $and: $matchConditions }});
    }

    pipeline.push(
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
    );

    return pipeline;
  }

  public async getRentResidential(
    filter: IGetRentResidentialQuery,
    sort: IGetRentResidentialSort,
    offset: number = 0,
    limit: number = 25,
  ): Promise<{ data: IRentResidentialId[]; total: number }> {
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
    // const pipeline = this.getResidentialPipelineBuilder(filter, sort, offset, limit);
    // const pipelineString = JSON.stringify(pipeline, null, 2);
    // const filePath = './pipelineResult.json';
    //
    // writeFileSync(filePath, pipelineString);

    const result = (await this.saleResidentialsModel
      .aggregate(this.getResidentialPipelineBuilder(filter, sort, offset, limit))
      .exec()
    )?.[0] ?? EMPTY_SEARCH_RESULT;

    return {
      total: result.total,
      data: result.data.map(toSaleResidentialIdMapper),
    };
  }
}
