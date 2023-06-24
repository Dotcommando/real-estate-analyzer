import { Inject, Injectable, LoggerService } from '@nestjs/common';
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
  LOGGER,
  Mode,
  OnlineViewing,
  OnlineViewingArray,
  Parking,
  ParkingArray,
  Pets,
  PetsArray,
  Share,
  ShareArray,
  SlugByCategory,
} from '../constants';
import { IRealEstate } from '../types';
import { castToNumber, roundDate } from '../utils';


@Injectable()
export class DbAccessService {
  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    private moduleRef: ModuleRef,
  ) {}

  private readonly mode = this.configService.get<Mode>('MODE');

  private getModelByUrl(categoryUrl: string): Model<any> | null {
    try {
      const modelName = SlugByCategory[categoryUrl];

      return this.moduleRef.get(modelName + 'Model', { strict: false });
    } catch (e) {
      return null;
    }
  }

  private typecastingFields(announcementData: Partial<IRealEstate>): Partial<IRealEstate> {
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

    return announcementData;
  }

  public async saveNewAnnouncement(categoryUrl: string, announcementData: Partial<IRealEstate>): Promise<IRealEstate | null> {
    try {
      const Model = this.getModelByUrl(categoryUrl);

      if (!Model) {
        return null;
      }

      const existingAnnouncement = await Model.findOne({ ad_id: announcementData.ad_id });

      if (existingAnnouncement) {
        this.logger.log(`A duplicate found for ad ${announcementData.ad_id} in the DB.`);

        const roundedDate = roundDate(new Date());
        const roundedDateAsString = roundedDate.toString();

        if (
          !existingAnnouncement.active_dates
            .map(date => date.toString()).includes(roundedDateAsString)
        ) {
          existingAnnouncement.active_dates.push(roundedDate);
          await existingAnnouncement.save();
        }

        return existingAnnouncement;
      } else {
        this.logger.log(`No duplicates found for ad ${announcementData.ad_id} in the DB.`);

        const newAnnouncement = new Model({
          ...this.typecastingFields(announcementData),
          mode: this.mode,
        });

        newAnnouncement.active_dates = [ roundDate(new Date()) ];
        await newAnnouncement.save();

        return newAnnouncement;
      }
    } catch (e) {
      this.logger.log(' ');
      this.logger.error('Error happened in \'saveNewAnnouncement\' method.');
      this.logger.error('categoryUrl:', categoryUrl);
      this.logger.error(' ');
      this.logger.error(e);
    }
  }

  public async addActiveDate(categoryUrl: string, ad_id: string, activeDate: Date | number): Promise<IRealEstate | null> {
    const Model = this.getModelByUrl(categoryUrl);

    if (!Model) {
      return null;
    }

    const existingAnnouncement = await Model.findOne({ ad_id });

    if (!existingAnnouncement) {
      return null;
    }

    const roundedDate = roundDate(new Date(activeDate));
    const roundedDateAsString = roundedDate.toISOString();

    if (
      !existingAnnouncement.active_dates
        .map(date => date.toISOString()).includes(roundedDateAsString)
    ) {
      existingAnnouncement.active_dates.push(roundedDate);
      await existingAnnouncement.save();
    }

    return existingAnnouncement;
  }
}
