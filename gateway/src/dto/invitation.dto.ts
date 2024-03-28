import { IsString, Length } from 'class-validator';


export class CreateInvitationDto {
  @IsString()
  @Length(1, 128)
  rawToken: string;

  @IsString()
  description: string;
}

export class DeleteInvitationDto {
  @IsString()
  @Length(1, 128)
  rawToken: string;
}

export class ValidateInvitationDto {
  @IsString()
  @Length(1, 128)
  rawToken: string;
}
