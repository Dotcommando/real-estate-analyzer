import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsDefined, IsEnum, IsOptional } from 'class-validator';
import { AdsEnum } from 'src/constants';

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

  @ApiProperty({
    description: 'Limit',
    required: false,
    example: '20',
  })
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    description: 'Offset',
    required: false,
    example: '0',
  })
  @IsOptional()
  @Type(() => Number)
  offset?: number;

  @ApiProperty({
    description: 'City',
    required: false,
    example: 'Nicosia',
  })
  @IsOptional()
  @Type(() => String)
  city?: string;

  @ApiProperty({
    description: 'District',
    required: false,
    example: 'Egkomi',
  })
  @IsOptional()
  @Type(() => String)
  district?: string;

  @ApiProperty({
    description: `Type of ads, can be: ${Object.values(AdsEnum).join(', ')}`,
    required: true,
    example: AdsEnum.RentFlats,
  })
  @IsEnum(AdsEnum)
  ads: AdsEnum;
}
