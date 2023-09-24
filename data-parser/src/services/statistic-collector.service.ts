import { Injectable } from '@nestjs/common';

import { UrlTypes } from '../constants';


export enum STATISTIC_EVENT {
  RUN = 'run',
  PAGE_PROCESSING = 'page_processing',
  ADDING_TO_QUEUE = 'adding_to_queue',
}

export type AddToQueueEvent = {
  type: STATISTIC_EVENT.ADDING_TO_QUEUE;
  ok: boolean;
  collection: string;
  urlType: UrlTypes;
  found: boolean;
  dateMsec: number;
}

export type RunEvent = {
  type: STATISTIC_EVENT.RUN;
  ok: boolean;
  runType: 'first_run' | 'full' | 'deep' | 'moderate' | 'superficial' | 'shallow';
  dateMsec: number;
}

export type ProcessingEvent = {
  type: STATISTIC_EVENT.PAGE_PROCESSING;
  ok: boolean;
  collection: string;
  urlType: UrlTypes;
  processing: 'pagination_parsed' | 'added' | 'active_date' | 'no_changes' | 'error';
  errorMsg?: string;
  dateMsec: number;
}

export type StatEvent = AddToQueueEvent | RunEvent | ProcessingEvent;

@Injectable()
export class StatisticCollectorService {
  private logArray: StatEvent[] = [];

  public add(eventData: Omit<StatEvent, 'dateMsec'>) {
    this.logArray.push({
      ...eventData,
      dateMsec: Date.now(),
    } as StatEvent);
  }
}
