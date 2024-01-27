import { IsOptional, IsString } from 'class-validator';


export class RangeDto {
  @IsOptional()
  @IsString()
  $gte?: string;

  @IsOptional()
  @IsString()
  $lte?: string;

  @IsOptional()
  @IsString()
  $gt?: string;

  @IsOptional()
  @IsString()
  $lt?: string;

  @IsOptional()
  @IsString()
  $eq?: string;
}
