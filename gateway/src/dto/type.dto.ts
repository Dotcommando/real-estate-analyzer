import { IsIn } from 'class-validator';


export class TypeDto {
  @IsIn([ 'sale', 'rent' ], { message: 'Type must be either sale or rent' })
  type: 'sale' | 'rent';
}
