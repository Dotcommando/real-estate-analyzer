import { HttpService } from '@nestjs/axios';
import { HttpStatus, Inject, Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { CacheService } from './cache.service';
import { DelayService } from './delay.service';

import { LOGGER, UrlTypes } from '../constants';
import { IQueue, IQueueElement, ITcpMessageResult, IUrlData } from '../types';


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
  private maxAttempts: number;
  private axiosConfig: AxiosRequestConfig;

  public async onModuleInit(): Promise<void> {
    this.initAxiosConfigData();
    this.initQueues();

    for (const queueName of this.queuesNames) {
      this.queues[queueName] = {};
    }

    this.addMockTasks();
    this.runQueues();
  }

  private getEnvVariableAsInteger(varName: string, defaultValue: number): number {
    let result: number;

    try {
      result = parseInt(this.configService.get(varName));

      return isNaN(result)
        ? defaultValue
        : result;
    } catch (e) {
      return defaultValue;
    }
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

  private initAxiosConfigData(): void {
    this.maxAttempts = this.getEnvVariableAsInteger('MAX_ATTEMPTS', 5);
    this.axiosConfig = {
      timeout: this.getEnvVariableAsInteger('HTTP_GET_TIMEOUT', 10000),
      maxRedirects: this.getEnvVariableAsInteger('MAX_REDIRECTS', 3),
    };
  }

  private runQueues() {
    for (const queueName in this.queues) {
      this.runQueue(this.queues[queueName], queueName);
    }
  }

  private async runQueue(queue: IQueue, queueName: string): Promise<void> {
    console.timeEnd(queueName);
    console.log(' ');
    console.time(queueName);
    console.log(queue);

    const elementWithMaxPriority: IQueueElement | null = this.getFirstElementWithMaxPriority(queue);

    // console.log('elementWithMaxPriority', elementWithMaxPriority);

    if (elementWithMaxPriority) {
      try {
        const pageDataResponse: AxiosResponse = await this.httpService.axiosRef
          .get(elementWithMaxPriority.url, this.axiosConfig);

        if (pageDataResponse.status === HttpStatus.OK) {
          const tcpMessageResult: ITcpMessageResult = {
            success: true,
            data: pageDataResponse.data,
            urlData: { ...elementWithMaxPriority },
          };

          // Send tcpResponse here to microservice which processes it.

          this.removeElementFromQueueByUrl(queue, elementWithMaxPriority.url, elementWithMaxPriority.priority);
        }
      } catch (e) {
        if (e.response?.status === HttpStatus.NOT_FOUND) {
          this.logger.error(`Not found: ${elementWithMaxPriority.url}`);
          this.removeElementFromQueueByUrl(queue, elementWithMaxPriority.url, elementWithMaxPriority.priority);
        } else {
          this.logger.error(`Unknown error: ${elementWithMaxPriority.url}`);

          if (e.message) {
            this.logger.error(e.message);
          }

          this.moveElementToEndOfQueue(queue, elementWithMaxPriority);
        }
      }
    }

    await this.delayService.delay();

    // this.logger.log(queueName);

    await this.runQueue(queue, queueName);
  }

  private getFirstElementWithMaxPriority(queue: IQueue): IQueueElement | null {
    const availablePriorities = Object.keys(queue).map((key: string) => parseInt(key));

    if (!availablePriorities.length) {
      return null;
    }

    const maxPriority = Math.max(...availablePriorities);

    return queue[String(maxPriority)][0];
  }

  private removeElementFromQueueByUrl(queue: IQueue, url: string, priority: number): void {
    const priorityArray: IQueueElement[] = queue[String(priority)];
    const foundElementIndex = priorityArray.findIndex((el: IQueueElement) => el.url === url);

    if (foundElementIndex === -1) {
      return;
    }

    priorityArray.splice(foundElementIndex, 1);

    if (!priorityArray.length) {
      delete queue[String(priority)];
    }
  }

  private moveElementToEndOfQueue(queue: IQueue, element: IQueueElement): void {
    const priorityArray: IQueueElement[] = queue[String(element.priority)];
    const foundElementIndex = priorityArray.findIndex((el: IQueueElement) => el.url === element.url);

    if (foundElementIndex === -1) {
      return;
    }

    priorityArray.splice(foundElementIndex, 1);

    if (!element.attempt || element.attempt < this.maxAttempts) {
      priorityArray.push({
        ...element,
        attempt: element.attempt ? element.attempt + 1 : 1,
      });
    } else if (!priorityArray.length) {
      delete queue[String(element.priority)];
    }
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
    const queue: IQueue = this.queues[queueName];

    if (!queue) {
      return null;
    }

    const priorityArray: IQueueElement[] = queue[taskToFind.priority];

    if (!priorityArray || !priorityArray.length) {
      return null;
    }

    return priorityArray.find((task: IQueueElement) => task.url === taskToFind.url) ?? null;
  }

  private getPriorityArray(priority: number, queueName?: string): IQueueElement[] {
    const name = queueName ?? this.defaultQueueName;
    const queue: IQueue = this.queues[name];

    if (!queue) {
      throw new Error(`No such queue name found: ${typeof queueName === 'object' ? JSON.stringify(queueName) : String(queueName)}`);
    }

    if (!queue[priority]) {
      // There is priority transformed to string
      // If priority was 1 (as number), then `queue['1'] = [];`
      queue[priority] = [];
    }

    return queue[priority];
  }

  public addPageToQueue(urlData: IUrlData): boolean {
    try {
      const found: IUrlData = this.findTaskDuplicate(urlData);

      if (!found) {
        const priorityArray: IQueueElement[] = this.getPriorityArray(urlData.priority, urlData.queueName);
        const taskToAdd: IUrlData = { ...urlData };

        delete taskToAdd.queueName;

        priorityArray.push(taskToAdd as IQueueElement);

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
