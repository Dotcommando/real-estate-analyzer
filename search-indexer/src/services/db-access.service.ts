import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { Model } from 'mongoose';

import {
  AnalysisType,
  CitySlugByCollection,
  DistrictSlugByCollection,
  SearchResultsSlugByCollection,
  SlugByCollection,
} from '../constants';


@Injectable()
export class DbAccessService {
  constructor(
    private moduleRef: ModuleRef,
  ) {
  }

  public getModelByCollection(collectionName: string): Model<any> | null {
    try {
      const modelName = SlugByCollection[collectionName];

      return this.moduleRef.get(modelName + 'Model', { strict: false });
    } catch (e) {
      return null;
    }
  }

  public getAnalysisModelByCollection(collectionName: string, analysisType: AnalysisType): Model<any> | null {
    try {
      let modelName;

      switch (analysisType) {
        case AnalysisType.CITY_AVG_MEAN:
          modelName = CitySlugByCollection[collectionName];

          break;

        case AnalysisType.DISTRICT_AVG_MEAN:
          modelName = DistrictSlugByCollection[collectionName];

          break;
      }

      if (!modelName) {
        throw new Error(`Cannot get Analytics Model by collection name '${collectionName}' for type ${analysisType}`);
      }

      return this.moduleRef.get(modelName + 'Model', { strict: false });
    } catch (e) {
      return null;
    }
  }

  public getSearchResultsModelByCollection(collectionName: string): Model<any> | null {
    try {
      const modelName = SearchResultsSlugByCollection[collectionName];

      return this.moduleRef.get(modelName + 'Model', { strict: false });
    } catch (e) {
      return null;
    }
  }

  public getRelatedAnalysisCollection(collectionName: string): string {
    return collectionName + '_analysis';
  }
}
