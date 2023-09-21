import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { AdsEnum, AdsEnumArray, AnalysisType, AnalysisTypeArray, LOGGER } from '../constants';
import { analysisMapper, cityReportMapper, districtReportMapper } from '../mappers';
import {
  IAdsParams,
  IAdsResult,
  IAnalysisParams,
  IAnalysisResult,
  ICityStats,
  ICityStatsDoc,
  IDistrictStats,
  IDistrictStatsDoc,
  IRentApartmentsFlats,
  IRentHouses,
  ISaleApartmentsFlats,
  ISaleHousesDoc,
} from '../types';


@Injectable()
export class DbAccessService {
  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    @InjectModel('CityStatsRentFlats') private readonly cityStatsRentFlatsModel: Model<ICityStatsDoc>,
    @InjectModel('CityStatsRentHouses') private readonly cityStatsRentHousesModel: Model<ICityStatsDoc>,
    @InjectModel('CityStatsSaleFlats') private readonly cityStatsSaleFlatsModel: Model<ICityStatsDoc>,
    @InjectModel('CityStatsSaleHouses') private readonly cityStatsSaleHousesModel: Model<ICityStatsDoc>,
    @InjectModel('DistrictStatsRentFlats') private readonly districtStatsRentFlatsModel: Model<IDistrictStatsDoc>,
    @InjectModel('DistrictStatsRentHouses') private readonly districtStatsRentHousesModel: Model<IDistrictStatsDoc>,
    @InjectModel('DistrictStatsSaleFlats') private readonly districtStatsSaleFlatsModel: Model<IDistrictStatsDoc>,
    @InjectModel('DistrictStatsSaleHouses') private readonly districtStatsSaleHousesModel: Model<IDistrictStatsDoc>,
    @InjectModel('SaleHouses') private readonly SaleHousesModel: Model<ISaleHousesDoc>,
    @InjectModel('SaleFlats') private readonly SaleFlatsModel: Model<ISaleApartmentsFlats>,
    @InjectModel('RentFlats') private readonly RentFlatsModel: Model<IRentApartmentsFlats>,
    @InjectModel('RentHouses') private readonly RentHousesModel: Model<IRentHouses>,
    private readonly configService: ConfigService,
  ) {
  }

  private getModel(analysisType: AnalysisType, ads: AdsEnum): Model<ICityStatsDoc | IDistrictStatsDoc> {
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

  private async getCityAnalysis(params: IAnalysisParams): Promise<IAnalysisResult<ICityStats>[]> {
    const model = this.getModel(params.analysisType, params.ads);
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
    const model = this.getModel(params.analysisType, params.ads);
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


  public async getAds(params: IAdsParams): Promise<IAdsResult> {
    return await this.SaleHousesModel.find().limit(1);
  }
}
