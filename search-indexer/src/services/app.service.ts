import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { config } from 'dotenv';

import { IResponse } from '../types';


config();

@Injectable()
export class AppService implements OnModuleInit {
  public checkHealth(): IResponse<{ alive: boolean }> {
    return {
      status: HttpStatus.OK,
      data: {
        alive: true,
      },
    };
  }

  async onModuleInit(): Promise<void> {
    await this.removeExpiredDocs();
    await this.addNewDocs();
  }

  @Cron(process.env.CRON_REMOVE_EXPIRED)
  private async addNewDocs(): Promise<void> {

  }

  @Cron(process.env.CRON_ADD_NEW)
  private async removeExpiredDocs(): Promise<void> {

  }
}
