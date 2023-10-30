import { HttpService } from '@nestjs/axios';
import { HttpStatus, Inject, Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from 'dotenv';
import { lastValueFrom, timeout } from 'rxjs';

import { CacheService } from './cache.service';
import { DelayService } from './delay.service';
import { ProxyFactoryService } from './proxy-factory.service';

import { DataParserMessages, LOGGER, UrlTypes } from '../constants';
import {
  IAddToQueueResult,
  IQueue,
  IQueueElement,
  ITask,
  ITcpResponse,
  IWebScrapingResponse,
} from '../types';


config();

interface ITaskDuplicate {
  taskFound: IQueueElement;
  priority: string;
  index: number;
  priorityArray: IQueueElement[];
}

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly cacheManager: CacheService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly delayService: DelayService,
    private readonly proxyFactory: ProxyFactoryService,
  ) {
  }

  private defaultQueueName: string;
  private queuesNames: string[] = [];
  private queues: { [key: string]: IQueue } = {};
  private maxAttempts: number;
  private axiosConfig: AxiosRequestConfig;
  private tcpTimeout = parseInt(this.configService.get<string>('TCP_TIMEOUT'));

  public async onModuleInit(): Promise<void> {
    this.initAxiosConfigData();
    this.initQueuesDefaults();

    for (const queueName of this.queuesNames) {
      this.queues[queueName] = {
        priorities: {},
        lastLaunchMsec: 0,
      };
    }

    this.runQueues();
  }

  @Cron(process.env.CLEAR_CACHE, {
    name: 'clear_cache',
    timeZone: process.env.TZ,
  })
  public clearCache() {
    this.cacheManager.clear();
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

  private initQueuesDefaults(): void {
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
    this.logger.log(' ');
    this.logger.log(`Queue name: ${queueName}, last run: ${(Date.now() - queue.lastLaunchMsec) / 1000} s ago.`);

    if (Object.keys(queue.priorities).length) {
      this.logger.log('Priorities:');
      // this.logger.log(queue.priorities);

      for (const priority in queue.priorities) {
        const taskNumber = queue.priorities[priority].length;

        this.logger.log(`[${priority}]: ${taskNumber} ${taskNumber === 1 ? 'task' : 'tasks'}.`);
      }
    } else {
      this.logger.log('No priorities found in the queue.');
    }

    queue.lastLaunchMsec = Date.now();

    const elementWithMaxPriority: IQueueElement | null = this.getFirstElementWithMaxPriority(queue);

    if (elementWithMaxPriority) {
      await this.processQueueElement(queue, elementWithMaxPriority);
    }

    await this.delayService.delay(queue.lastLaunchMsec);

    await this.runQueue(queue, queueName);
  }

  private async processQueueElement(queue: IQueue, element: IQueueElement): Promise<void> {
    let pageDataResponse: AxiosResponse;

    try {
      pageDataResponse = await this.httpService.axiosRef
        .get(element.url, this.axiosConfig);
    } catch (e) {
      this.logger.error(' ');
      this.logger.error('Error occurred in AppService.processQueueElement, phase: scraping data');

      if (e.response?.status === HttpStatus.NOT_FOUND) {
        this.logger.error(`Not found: ${element.url}`);
        this.removeElementFromQueueByUrl(queue, element.url, element.priority);
      } else {
        this.logger.error(`Unknown error: ${element.url}`);

        if (e.message) {
          this.logger.error(e.message);
        }

        this.moveElementToEndOfQueue(queue, element);
      }

      return;
    }

    try {
      if (pageDataResponse.status === HttpStatus.OK) {
        const scrapingResult: IWebScrapingResponse = {
          success: true,
          data: pageDataResponse.data,
          task: { ...element },
        };

        await lastValueFrom(
          this.proxyFactory.getClientProxy(element.host, element.port)
            .send(DataParserMessages.PARSE_PAGE, scrapingResult)
            .pipe(timeout(this.tcpTimeout)),
        );

        this.removeElementFromQueueByUrl(queue, element.url, element.priority);

        if (element.urlType === UrlTypes.Ad) {
          this.cacheManager.set(element.url, true);
        }
      }
    } catch (e) {
      this.logger.error(' ');
      this.logger.error('Error occurred in AppService.processQueueElement, phase: sending data for parsing');

      if (e.message) {
        this.logger.error(e.message);
      }

      this.moveElementToEndOfQueue(queue, element);
    }
  }

  private getFirstElementWithMaxPriority(queue: IQueue): IQueueElement | null {
    try {
      const availablePriorities = Object.keys(queue.priorities)
        .map((key: string) => parseInt(key));

      if (!availablePriorities.length) {
        return null;
      }

      const maxPriority = Math.max(...availablePriorities);

      return queue.priorities[String(maxPriority)][0];
    } catch (e) {
      this.logger.error(' ');
      this.logger.error('Error occurred in AppService.getFirstElementWithMaxPriority');
      this.logger.error(e);

      return null;
    }
  }

  private removeElementFromQueueByUrl(queue: IQueue, url: string, priority: number): void {
    const priorityArray: IQueueElement[] = queue.priorities[String(priority)];
    const foundElementIndex = priorityArray.findIndex((el: IQueueElement) => el.url === url);

    if (foundElementIndex === -1) {
      return;
    }

    priorityArray.splice(foundElementIndex, 1);

    if (!priorityArray.length) {
      delete queue.priorities[String(priority)];
    }
  }

  private moveElementToEndOfQueue(queue: IQueue, element: IQueueElement): void {
    const priorityArray: IQueueElement[] = queue.priorities[String(element.priority)];
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
      delete queue.priorities[String(element.priority)];
    }
  }

  public addPagesToQueue(tasks: ITask[]): ITcpResponse<{ [url: string]: IAddToQueueResult }> {
    const result: { [url: string]: { added: boolean; reason?: string } } = {};

    for (const task of tasks) {
      result[task.url] = this.addPageToQueue(task);
    }

    return {
      success: true,
      data: result,
    };
  }

  private findTaskDuplicate(taskToFind: ITask): ITaskDuplicate | null {
    const queueName = taskToFind.queueName ?? this.defaultQueueName;
    const queue: IQueue = this.queues[queueName];

    if (!queue) {
      return null;
    }

    const priorities = Object.keys(queue.priorities);

    for (const priority of priorities) {
      const currentPriorityArray: IQueueElement[] | undefined = queue.priorities[priority];
      const taskFound: IQueueElement = currentPriorityArray.find((el: IQueueElement) => el.url === taskToFind.url);

      if (Boolean(taskFound)) {
        return {
          taskFound,
          priority,
          index: currentPriorityArray.findIndex((el: IQueueElement) => el.url === taskFound.url),
          priorityArray: currentPriorityArray,
        };
      }
    }

    return null;
  }

  private getPriorityArray(priority: number, queueName?: string): ITask[] {
    const name = queueName ?? this.defaultQueueName;
    const queue: IQueue = this.queues[name];

    if (!queue) {
      throw new Error(`No such queue name found: ${typeof queueName === 'object' ? JSON.stringify(queueName) : String(queueName)}`);
    }

    if (!queue.priorities[priority]) {
      // There is priority transforms to string
      // If priority was 1 (as number), then `queue.priorities['1'] = [];`
      queue.priorities[priority] = [];
    }

    return queue.priorities[priority];
  }

  private changePriority(task: ITask, duplicate: ITaskDuplicate): IAddToQueueResult {
    try {
      const startPriority = duplicate.priority;
      const desiredPriority = task.priority;

      duplicate.priorityArray.splice(duplicate.index, 1);

      if (duplicate.priorityArray.length === 0) {
        delete this.queues[task.queueName].priorities[duplicate.priority];
      }

      const taskAddingResult: IAddToQueueResult = this.pushTaskToPriorityArray(task);

      return taskAddingResult.added
        ? {
          added: true,
          reason: `Priority changed from ${startPriority} to ${desiredPriority}`,
        }
        : {
          added: false,
          reason: `Cannot change priority from ${startPriority} to ${desiredPriority}`,
        };
    } catch (e) {
      this.logger.error(' ');
      this.logger.error('Error occurred in AppService.changePriority');
      this.logger.error(e);

      return {
        added: false,
        reason: `An error in AppService.changePriority. ${e.message}`,
      };
    }
  }

  private pushTaskToPriorityArray(task: ITask): IAddToQueueResult {
    try {
      const priorityArray: IQueueElement[] = this.getPriorityArray(task.priority, task.queueName);
      const taskToAdd: ITask = { ...task };

      priorityArray.push(taskToAdd as IQueueElement);

      return { added: true };
    } catch (e) {
      this.logger.error(' ');
      this.logger.error('Error occurred in AppService.pushTaskToPriorityArray');
      this.logger.error(e);

      return {
        added: false,
        reason: `An error in AppService.pushTaskToPriorityArray. ${e.message}`,
      };
    }
  }

  public addPageToQueue(task: ITask): IAddToQueueResult {
    try {
      const duplicate: ITaskDuplicate = this.findTaskDuplicate(task);
      const cacheFound: boolean = Boolean(this.cacheManager.get(task.url));

      if (cacheFound) {
        return {
          added: false,
          reason: 'The URL found in the cache',
        };
      }

      if (duplicate && duplicate.priority === String(task.priority)) {
        return {
          added: false,
          reason: 'A full duplicate found',
        };
      }

      if (duplicate && Number(duplicate.priority) > task.priority) {
        return {
          added: false,
          reason: `A duplicate with higher pr. found (${duplicate.priority} > ${task.priority})`,
        };
      }

      if (duplicate && Number(duplicate.priority) < task.priority) {
        return this.changePriority(task, duplicate);
      }

      return this.pushTaskToPriorityArray(task);
    } catch (e) {
      this.logger.error(' ');
      this.logger.error('Error occurred in AppService.addPageToQueue');
      this.logger.error('Task:');
      this.logger.error(task);
      this.logger.error(e);

      return {
        added: false,
        reason: `Error. ${e.message}`,
      };
    }
  }
}
