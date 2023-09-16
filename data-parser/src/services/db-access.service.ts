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
  Mode,
  OnlineViewing,
  OnlineViewingArray,
  Parking,
  ParkingArray,
  Pets,
  PetsArray,
  Share,
  ShareArray,
  SlugByCollection,
} from '../constants';
import { IAdDBOperationResult, IRealEstate, IRealEstateDoc } from '../types';
import { castToNumber, dateInHumanReadableFormat, roundDate } from '../utils';


@Injectable()
export class DbAccessService {
  constructor(
    private readonly configService: ConfigService,
    private moduleRef: ModuleRef,
  ) {}

  private readonly mode = this.configService.get<Mode>('MODE');

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
      'square-meter-price',
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

    return announcementData;
  }

  public async saveNewAnnouncement(collectionName: string, announcementData: Partial<IRealEstate>): Promise<IAdDBOperationResult> {
    try {
      const Model = this.getModelByCollection(collectionName);

      if (!Model) {
        return { ad: null, status: `Model not found for collection: ${ collectionName }.` };
      }

      const existingAnnouncement = await Model.findOne({ ad_id: announcementData.ad_id });
      let status: string;

      if (existingAnnouncement) {
        const roundedDate = roundDate(new Date());
        const roundedDateAsString = roundedDate.toString();

        if (
          !existingAnnouncement.active_dates
            .map(date => date.toString())
            .includes(roundedDateAsString)
        ) {
          existingAnnouncement.active_dates.push(roundedDate);
          await existingAnnouncement.save();

          status = `Has a duplicate in DB. Added active date: ${dateInHumanReadableFormat(roundedDate, 'DD.MM.YYYY')}. Collection: ${Model.collection.name}.`;
        } else {
          status = `Has a duplicate in DB. No active date added. Collection: ${Model.collection.name}.`;
        }

        return { ad: existingAnnouncement.toObject(), status };
      } else {
        const newAnnouncement = new Model({
          ...this.typecastingFields(announcementData),
          mode: this.mode,
        });

        newAnnouncement.active_dates = [ roundDate(new Date()) ];
        await newAnnouncement.save();

        status = `Saved in DB. Collection: ${Model.collection.name}.`;

        return { ad: newAnnouncement.toObject(), status };
      }
    } catch (e) {
      return {
        ad: null,
        status: typeof e.message === 'string' ? e.message : String(e),
        error: true,
      };
    }
  }

  public async findDuplicate(categoryUrl: string, url: string): Promise<IAdDBOperationResult<IRealEstateDoc>> {
    try {
      const Model = this.getModelByCollection(categoryUrl);

      if (!Model) {
        return { ad: null, status: `model not found for category: ${ categoryUrl }.` };
      }

      const existingAnnouncement: IRealEstateDoc = await Model.findOne({ url: url });

      if (!existingAnnouncement) {
        return { ad: null, status: `Ad not found for url: ${ url }.` };
      }

      return { ad: existingAnnouncement, status: '' };
    } catch (e) {
      return {
        ad: null,
        status: typeof e.message === 'string' ? e.message : String(e),
        error: true,
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
        ...(existingAnnouncementResponse.error && { error: true }),
      };
    }

    const roundedDate = roundDate(new Date(activeDate));
    const roundedDateAsString = roundedDate.toISOString();
    let status: string;

    if (
      !existingAnnouncement.active_dates
        .map(date => date.toISOString()).includes(roundedDateAsString)
    ) {
      status = `Added active date ${dateInHumanReadableFormat(roundedDate, 'DD.MM.YYYY')}. Collection: ${existingAnnouncement.collection.name}.`;

      existingAnnouncement.active_dates.push(roundedDate);
      await existingAnnouncement.save();

      return { ad: existingAnnouncement.toObject(), status };
    }

    return { ad: existingAnnouncement.toObject(), status: 'Current date already added.' };
  }
}
