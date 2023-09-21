import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsDefined, IsEnum, IsOptional } from 'class-validator';

import { AdsEnum, AnalysisPeriod, AnalysisType } from '../constants';
import { IsDate } from '../decorators';


export class AdsDto {
  @ApiProperty({
    description: 'Date in format YYYY-MM-DD',
    required: true,
    example: '2023-07-28',
  })
  @IsDefined()
  @Type(() => Date)
  @IsDate()
  start_date: Date;

  @ApiProperty({
    description: 'Date in format YYYY-MM-DD',
    required: false,
    example: '2023-07-28',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ optional: true })
  end_date?: Date;
}
