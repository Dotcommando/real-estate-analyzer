import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';

import { CacheService } from './cache.service';
import { DbAccessService } from './db-access.service';
import { LoggerService } from './logger.service';
import { SearchEngineService } from './search-engine.service';


jest.mock('./logger.service');
jest.mock('@nestjs/config');
jest.mock('./db-access.service');

describe('SearchEngineService', () => {
  let service: SearchEngineService;
  let loggerService: LoggerService;
  let configService: ConfigService;
  let cacheManager: CacheService;
  let dbAccessService: DbAccessService;
  let moduleRef: ModuleRef;

  beforeEach(() => {
    loggerService = new LoggerService();

    configService = new ConfigService();
    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      switch (key) {
        case 'SEARCH_INDEX_CONFIG':
          return JSON.stringify([
            { collections: [ 'rentapartmentsflats', 'renthouses' ], mapTo: 'sr_rentresidentials' },
            { collections: [ 'saleapartmentsflats', 'salehouses' ], mapTo: 'sr_saleresidentials' },
          ]);

        case 'PROCESS_DOCS_PER_ONE_TIME':
          return '20';

        default:
          return null;
      }
    });

    cacheManager = new CacheService(loggerService, configService);
    moduleRef = jest.fn() as unknown as ModuleRef;
    dbAccessService = new DbAccessService(moduleRef);

    service = new SearchEngineService(loggerService, configService, cacheManager, dbAccessService);
  });

  describe('parseCronPattern', () => {
    it.each([
      [ '*/15 * * * *', 15, [ 0, 15, 30, 45 ] ],
      [ '0,15,30,45 * * * *', 60, [ 0, 15, 30, 45 ] ],
      [ '5-55/10 * * * *', 10, [ 5, 15, 25, 35, 45, 55 ] ],
      [ '0 * * * *', 60, [ 0 ] ],
      [ '*/1 * * * *', 1, Array.from({ length: 60 }, (_, i) => i) ],
      [ '*', 60, [] ],
    ])(
      'should correctly parse cron pattern "%s"',
      (pattern, expectedInterval, expectedOffsets) => {
        const result = service['parseCronPattern'](pattern);

        expect(result.interval).toBe(expectedInterval);
        expect(result.offsets).toEqual(expectedOffsets);
      },
    );
  });

  describe('calculateTimeThreshold', () => {
    it.each([
      [ '8-59/4 * * * *', new Date('2024-01-20T06:00:00'), new Date('2024-01-20T05:56:00').getTime() ],
      [ '8-59/4 * * * *', new Date('2024-01-20T07:02:00'), new Date('2024-01-20T06:56:00').getTime() ],
      [ '8-59/4 * * * *', new Date('2024-01-01T00:07:00'), new Date('2023-12-31T23:56:00').getTime() ],
      [ '8-59/4 * * * *', new Date('2024-01-01T00:08:00'), new Date('2023-12-31T23:56:00').getTime() ],
      [ '8-59/4 * * * *', new Date('2024-01-01T00:10:00'), new Date('2024-01-01T00:08:00').getTime() ],
      [ '8-59/4 * * * *', new Date('2024-01-01T00:40:00'), new Date('2024-01-01T00:36:00').getTime() ],
      [ '*/15 * * * *', new Date('2024-01-20T08:30:00'), new Date('2024-01-20T08:15:00').getTime() ],
    ])(
      'should correctly calculate time of last execution for cron pattern "%s" at time %s',
      (pattern, currentTime, expectedThreshold) => {
        const result = service['calculateLastExecutionTimestamp'](pattern, currentTime);

        expect(result).toBe(expectedThreshold);
      },
    );
  });
});
