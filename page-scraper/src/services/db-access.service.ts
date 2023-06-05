import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { Model } from 'mongoose';

import { SlugByCategory } from '../constants/categories';
import { IRealEstate } from '../types';
import { roundDate } from '../utils';


@Injectable()
export class DbAccessService {
  constructor(private moduleRef: ModuleRef) {}

  private getModelByUrl(categoryUrl: string): Model<any> | null {
    try {
      const modelName = SlugByCategory[categoryUrl];

      return this.moduleRef.get(modelName + 'Model', { strict: false });
    } catch (e) {
      return null;
    }
  }

  public async saveNewAnnouncement(categoryUrl: string, announcementData: Partial<IRealEstate>): Promise<IRealEstate | null> {
    const Model = this.getModelByUrl(categoryUrl);

    if (!Model) {
      return null;
    }

    const existingAnnouncement = await Model.findOne({ ad_id: announcementData.ad_id });

    if (existingAnnouncement) {
      const roundedDate = roundDate(new Date());

      if (!existingAnnouncement.active_dates.includes(roundedDate)) {
        existingAnnouncement.active_dates.push(roundedDate);
        await existingAnnouncement.save();
      }

      return existingAnnouncement;
    } else {
      const newAnnouncement = new Model({
        ...announcementData,
        'square-meter-price': announcementData['square-meter-price']
          ? announcementData['square-meter-price']
          : Math.round(announcementData['price'] * 100) / 100
      });

      newAnnouncement.active_dates = [ roundDate(new Date()) ];
      await newAnnouncement.save();

      return newAnnouncement;
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

    if (!existingAnnouncement.active_dates.includes(roundedDate)) {
      existingAnnouncement.active_dates.push(roundedDate);
      await existingAnnouncement.save();
    }

    return existingAnnouncement;
  }
}
