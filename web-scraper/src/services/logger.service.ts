import { Logger as NestLogger } from '@nestjs/common/services/logger.service';

import { AbstractLogger } from '../classes';


export class LoggerService extends NestLogger implements AbstractLogger {}
