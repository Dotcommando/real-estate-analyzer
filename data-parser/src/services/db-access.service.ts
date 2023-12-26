import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';

import { Model } from 'mongoose';

import {
  AirConditioning,
  AirConditioningArray,
  Condition,
  ConditionArray,
  EnergyEfficiency,
  EnergyEfficiencyArray,
  Furnishing,
  FurnishingArray,
  OnlineViewing,
  OnlineViewingArray,
  Parking,
  ParkingArray,
  Pets,
  PetsArray,
  PoolType,
  PoolTypeArray,
  Share,
  ShareArray,
  SlugByCollection,
  Source,
  StandardSet,
  StandardSetArray,
} from '../constants';
import { IAdDBOperationResult, IRealEstate, IRealEstateDoc } from '../types';
import { castToNumber, parseInteger, roundDate, setDefaultStandardValue } from '../utils';


export enum AdProcessingStatus {
  SAVED = 'saved',
  AD_FOUND = 'ad_found',
  AD_NOT_FOUND = 'ad_not_found',
  ACTIVE_DATE_ADDED = 'active_date_added',
  NO_CHANGES = 'no_changes',
  ERROR = 'error',
}

@Injectable()
export class DbAccessService {
  constructor(
    private readonly configService: ConfigService,
    private moduleRef: ModuleRef,
  ) {}

  private dbDocVersion = this.configService.get('DB_DOC_VERSION') ?? '1.0.0';

  private getModelByCollection(collectionName: string): Model<any> | null {
    try {
      const modelName = SlugByCollection[collectionName];

      return this.moduleRef.get(modelName + 'Model', { strict: false });
    } catch (e) {
      return null;
    }
  }

  public typecastingFields(announcementData: Partial<IRealEstate>): Partial<IRealEstate> {
    const forceMakeNumberProps = [
      'price',
      'property-area',
      'plot-area',
      'area',
      'bedrooms',
      'bathrooms',
      'registration-number',
      'registration-block',
    ];

    announcementData = castToNumber(announcementData, forceMakeNumberProps);

    if (!announcementData['source'] || (typeof announcementData['source'] !== 'string')) {
      announcementData['source'] = announcementData.url.includes(Source.BAZARAKI)
        ? Source.BAZARAKI
        : announcementData.url.includes(Source.OFFER)
          ? Source.OFFER
          : Source.UNKNOWN;
    }

    if ('parking-places' in announcementData) {
      announcementData['parking-places'] = parseInteger(String(announcementData['parking-places']), 1);
    }

    if ('online-viewing' in announcementData && !OnlineViewingArray.includes(announcementData['online-viewing'])) {
      announcementData['online-viewing'] = OnlineViewing.No;
    }

    if ('energy-efficiency' in announcementData && !EnergyEfficiencyArray.includes(announcementData['energy-efficiency'] as EnergyEfficiency)) {
      announcementData['energy-efficiency'] = EnergyEfficiency.NA;
    }

    if ('condition' in announcementData && !ConditionArray.includes(announcementData['condition'] as Condition)) {
      announcementData['condition'] = Condition.Resale;
    }

    if ('furnishing' in announcementData && !FurnishingArray.includes(announcementData['furnishing'] as Furnishing)) {
      announcementData['furnishing'] = Furnishing.Unfurnished;
    }

    if ('air-conditioning' in announcementData && !AirConditioningArray.includes(announcementData['air-conditioning'] as AirConditioning)) {
      announcementData['air-conditioning'] = AirConditioning.No;
    }

    if ('pets' in announcementData && !PetsArray.includes(announcementData['pets'] as Pets)) {
      announcementData['pets'] = Pets.NotAllowed;
    }

    if ('parking' in announcementData && !ParkingArray.includes(announcementData['parking'] as Parking)) {
      announcementData['parking'] = Parking.No;
    }

    if ('share' in announcementData && !ShareArray.includes(announcementData['share'] as Share)) {
      announcementData['share'] = Share.No;
    }

    if (typeof announcementData['type'] !== 'string') {
      announcementData['type'] = String(announcementData['type']);
    }

    if ('coords' in announcementData && announcementData['coords'] !== null) {
      if (typeof announcementData['coords'].lng !== 'number' || isNaN(announcementData['coords'].lng)) {
        delete announcementData['coords'];
      } else if (typeof announcementData['coords'].lat !== 'number' || isNaN(announcementData['coords'].lat)) {
        delete announcementData['coords'];
      } else {
        announcementData['coords'].latTitle = 'N';
        announcementData['coords'].lngTitle = 'E';
      }
    } else if (announcementData['coords'] === null) {
      delete announcementData['coords'];
    }

    if ('pool' in announcementData && !PoolTypeArray.includes(announcementData['pool'] as PoolType)) {
      announcementData['pool'] = PoolType.No;
    }

    if (!('version' in announcementData)) {
      announcementData['version'] = this.dbDocVersion;
    }

    const fieldsWithStandardValues = [
      'alarm',
      'attic',
      'balcony',
      'elevator',
      'fireplace',
      'garden',
      'playroom',
      'storage',
    ];

    announcementData = setDefaultStandardValue(announcementData, fieldsWithStandardValues, StandardSetArray, StandardSet.NO);

    announcementData['updated_at'] = new Date();

    return announcementData;
  }

  public async saveNewAnnouncement(collectionName: string, announcementData: Partial<IRealEstate>): Promise<IAdDBOperationResult> {
    try {
      const Model = this.getModelByCollection(collectionName);

      if (!Model) {
        return { ad: null, status: AdProcessingStatus.ERROR, errorMsg: `Model not found for collection ${collectionName}` };
      }

      const existingAnnouncement = await Model.findOne({ ad_id: announcementData.ad_id });
      let status: string;

      if (existingAnnouncement) {
        const roundedDate = roundDate(new Date());
        const roundedDateAsString = roundedDate.toString();
        let changed = false;

        if (!existingAnnouncement['plot-area'] && (typeof announcementData['plot-area'] === 'number' && announcementData['plot-area'] !== 0)) {
          existingAnnouncement['plot-area'] = announcementData['plot-area'];

          changed = true;
        }

        if (
          !existingAnnouncement.active_dates
            .map(date => date.toString())
            .includes(roundedDateAsString)
        ) {
          existingAnnouncement.active_dates.push(roundedDate);
          changed = true;
        }

        if (changed) {
          await existingAnnouncement.save();
        }

        status = changed
          ? AdProcessingStatus.ACTIVE_DATE_ADDED
          : AdProcessingStatus.NO_CHANGES;

        return { ad: existingAnnouncement.toObject(), status };
      } else {
        announcementData['ad_last_updated'] = announcementData['publish_date'] instanceof Date
          ? announcementData['publish_date']
          : new Date(announcementData['publish_date']);

        const newAnnouncement = new Model({
          ...this.typecastingFields(announcementData),
        });

        newAnnouncement.active_dates = [ roundDate(new Date()) ];
        await newAnnouncement.save();

        status = AdProcessingStatus.SAVED;

        return { ad: newAnnouncement.toObject(), status };
      }
    } catch (e) {
      return {
        ad: null,
        status: AdProcessingStatus.ERROR,
        errorMsg: typeof e.message !== 'object' ? String(e.message) : JSON.stringify(e.message),
      };
    }
  }

  public async findDuplicate(categoryUrl: string, url: string): Promise<IAdDBOperationResult<IRealEstateDoc>> {
    try {
      const Model = this.getModelByCollection(categoryUrl);

      if (!Model) {
        return { ad: null, status: AdProcessingStatus.ERROR, errorMsg: `Model not found for collection ${categoryUrl}` };
      }

      const existingAnnouncement: IRealEstateDoc = await Model.findOne({ url: url });

      if (!existingAnnouncement) {
        return { ad: null, status: AdProcessingStatus.AD_NOT_FOUND };
      }

      return { ad: existingAnnouncement, status: AdProcessingStatus.AD_FOUND };
    } catch (e) {
      return {
        ad: null,
        status: AdProcessingStatus.ERROR,
        errorMsg: typeof e.message !== 'object' ? String(e.message) : JSON.stringify(e.message),
      };
    }
  }

  public async updateActiveDate(categoryUrl: string, url: string, activeDate: Date | number): Promise<IAdDBOperationResult> {
    const existingAnnouncementResponse: IAdDBOperationResult<IRealEstateDoc> = await this.findDuplicate(categoryUrl, url);
    const existingAnnouncement: IRealEstateDoc | null = existingAnnouncementResponse.ad;

    if (!existingAnnouncement) {
      return {
        ad: null,
        status: existingAnnouncementResponse.status,
        ...(existingAnnouncementResponse.errorMsg && { errorMsg: existingAnnouncementResponse.errorMsg }),
      };
    }

    const roundedDate = roundDate(new Date(activeDate));
    const roundedDateAsString = roundedDate.toISOString();
    let status: string;

    if (
      !existingAnnouncement.active_dates
        .map(date => date.toISOString()).includes(roundedDateAsString)
    ) {
      status = AdProcessingStatus.ACTIVE_DATE_ADDED;

      existingAnnouncement.active_dates.push(roundedDate);
      await existingAnnouncement.save();

      return { ad: existingAnnouncement.toObject(), status };
    }

    return { ad: existingAnnouncement.toObject(), status: AdProcessingStatus.NO_CHANGES };
  }
}
