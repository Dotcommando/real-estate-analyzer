import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CacheService } from './cache.service';
import { DelayService } from './delay.service';

import { LOGGER, UrlTypes } from '../constants';
import { IQueue, ITcpResponse, IUrlData } from '../types';


@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly cacheManager: CacheService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly delayService: DelayService,
  ) {
  }

  private defaultQueueName: string;
  private queuesNames: string[] = [];
  private queues: { [key: string]: IQueue } = {};

  public async onModuleInit(): Promise<void> {
    this.initQueues();

    for (const queueName of this.queuesNames) {
      this.queues[queueName] = {};
    }

    this.addMockTasks();
    this.runQueues();
  }

  private initQueues(): void {
    try {
      this.defaultQueueName = this.configService.get('DEFAULT_QUEUE_NAME') ?? 'DEFAULT';
    } catch (e) {
      this.defaultQueueName = 'DEFAULT';
    }

    try {
      this.queuesNames = JSON.parse(this.configService.get('QUEUES_NAMES'));

      if (!this.queuesNames.length) {
        this.queuesNames.push(this.defaultQueueName);
      }
    } catch (e) {
      this.queuesNames.push(this.defaultQueueName);
    }
  }

  private runQueues() {
    for (const queueName in this.queues) {
      this.runQueue(this.queues[queueName], queueName);
    }
  }

  private async runQueue(queue: IQueue, queueName: string) {
    console.timeEnd(queueName);
    console.time(queueName);
    await this.delayService.delay();

    // this.logger.log(queueName);

    await this.runQueue(queue, queueName);
  }

  public addPagesToQueue(tasks: IUrlData[]): { [url: string]: boolean }[] {
    const result = [];

    for (const task of tasks) {
      result.push(this.addPageToQueue(task));
    }

    return result;
  }

  private findTaskDuplicate(taskToFind: IUrlData): IUrlData | null {
    const queueName = taskToFind.queueName ?? this.defaultQueueName;
    const queue = this.queues[queueName];

    if (!queue) {
      return null;
    }

    const priorityArray = queue[taskToFind.priority];

    if (!priorityArray || !priorityArray.length) {
      return null;
    }

    return priorityArray.find((task) => task.url === taskToFind.url) ?? null;
  }

  private getPriorityArray(priority: number, queueName?: string): Omit<IUrlData, 'queueName'>[] {
    const name = queueName ?? this.defaultQueueName;
    const queue = this.queues[name];

    if (!queue) {
      throw new Error(`No such queue name found: ${typeof queueName === 'object' ? JSON.stringify(queueName) : String(queueName)}`);
    }

    if (!queue[priority]) {
      queue[priority] = [];
    }

    return queue[priority];
  }

  public addPageToQueue(urlData: IUrlData): boolean {
    try {
      const found = this.findTaskDuplicate(urlData);

      if (!found) {
        const priorityArray = this.getPriorityArray(urlData.priority, urlData.queueName);
        const taskToAdd: IUrlData = { ...urlData };

        delete taskToAdd.queueName;

        priorityArray.push(taskToAdd as Omit<IUrlData, 'queueName'>);

        return true;
      }

      return false;
    } catch (e) {
      this.logger.error(' ');
      this.logger.error('Error occurred in AppService.addPageToQueue');
      this.logger.error(e);

      return false;
    }
  }

  private addMockTasks() {
    const mockTasks: IUrlData[] = [
      {
        priority: 1,
        url: 'https://www.bazaraki.com/adv/4743488_2-bedroom-apartment-to-rent/',
        urlType: UrlTypes.Ad,
        category: 'rentapartmentsflats',
        queueName: this.defaultQueueName,
      },
      {
        priority: 10,
        url: 'https://www.bazaraki.com/real-estate-to-rent/apartments-flats/',
        urlType: UrlTypes.Index,
        category: 'rentapartmentsflats',
        queueName: this.defaultQueueName,
      },
      {
        priority: 10,
        url: 'https://www.bazaraki.com/real-estate-to-rent/houses/',
        urlType: UrlTypes.Index,
        category: 'renthouses',
        queueName: 'ANOTHER_QUEUE',
      },
      {
        priority: 5,
        url: 'https://www.bazaraki.com/real-estate-to-rent/houses/?page=2',
        urlType: UrlTypes.Pagination,
        category: 'renthouses',
      },
      {
        priority: 5,
        url: 'https://www.bazaraki.com/real-estate-to-rent/houses/?page=3',
        urlType: UrlTypes.Pagination,
        category: 'renthouses',
      },
      {
        priority: 1,
        url: 'https://www.bazaraki.com/adv/4734899_2-bedroom-apartment-to-rent/',
        urlType: UrlTypes.Ad,
        category: 'rentapartmentsflats',
      },
      {
        priority: 1,
        url: 'https://www.bazaraki.com/adv/4743091_5-bedroom-detached-house-for-sale/',
        urlType: UrlTypes.Ad,
        category: 'salehouses',
      },
      {
        priority: 5,
        url: 'https://www.bazaraki.com/real-estate-to-rent/houses/?page=3',
        urlType: UrlTypes.Pagination,
        category: 'renthouses',
      },
    ];

    for (const task of mockTasks) {
      this.addPageToQueue(task);
    }

    for (const priority in this.queues[this.defaultQueueName]) {
      this.logger.log(' ');
      this.logger.log(' ');
      this.logger.log(`Priority ${priority}:`);

      for (const task of this.queues[this.defaultQueueName][priority]) {
        this.logger.log(task);
      }
    }
  }
}
