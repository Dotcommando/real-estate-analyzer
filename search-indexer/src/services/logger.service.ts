import { Logger as NestLogger } from '@nestjs/common';

import { AbstractLogger } from '../classes';


export class LoggerService extends NestLogger implements AbstractLogger {}
