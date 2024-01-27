import { IsString, MaxLength } from 'class-validator';
import { configDotenv } from 'dotenv';

import { getIntFromEnv } from '../utils';


configDotenv();

export class UrlItem {
  @IsString({ message: 'Each URL must be a string' })
  @MaxLength(getIntFromEnv('STRING_MAX_LENGTH', 64), { message: `Maximum length of each URL is ${process.env.STRING_MAX_LENGTH} characters` })
  url: string;
}
