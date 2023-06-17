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
    try {
      const Model = this.getModelByUrl(categoryUrl);

      if (!Model) {
        return null;
      }

      console.log(announcementData.ad_id);

      const existingAnnouncement = await Model.findOne({ ad_id: announcementData.ad_id });

      if (existingAnnouncement) {
        console.log('Exist a duplicate!');
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
        console.log('NEW!');
        const newAnnouncement = new Model(announcementData);

        newAnnouncement.active_dates = [ roundDate(new Date()) ];
        await newAnnouncement.save();

        return newAnnouncement;
      }
    } catch (e) {
      console.log(' ');
      console.log(' ');
      console.log('Error happened in \'saveNewAnnouncement\' method');
      console.log('categoryUrl:', categoryUrl);
      console.log('announcementData:');
      console.log(announcementData);
      console.log(' ');
      console.error(e);
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
