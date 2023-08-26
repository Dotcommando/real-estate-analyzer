import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsDefined, IsEnum, IsOptional } from 'class-validator';

import { AdsEnum, AnalysisPeriod, AnalysisType } from '../constants';
import { IsDate } from '../decorators';


export class StatsDto {
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

  @ApiProperty({
    description: `Type of analysis, can be: ${Object.values(AnalysisType).join(', ')}`,
    required: true,
    example: AnalysisType.CITY_AVG_MEAN,
  })
  @IsEnum(AnalysisType)
  analysis_type: AnalysisType;

  @ApiProperty({
    description: `Period of analysis, can be: ${Object.values(AnalysisPeriod).join(', ')}`,
    required: true,
    example: AnalysisPeriod.DAILY_TOTAL,
  })
  @IsEnum(AnalysisPeriod)
  analysis_period: AnalysisPeriod;

  @ApiProperty({
    description: `Type of ads, can be: ${Object.values(AdsEnum).join(', ')}`,
    required: true,
    example: AdsEnum.RentFlats,
  })
  @IsEnum(AdsEnum)
  ads: AdsEnum;
}
