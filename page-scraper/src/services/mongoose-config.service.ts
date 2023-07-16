import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

import { Mode } from '../constants';


@Injectable()
export class MongoConfigService implements MongooseOptionsFactory {
  constructor(
    private readonly configService: ConfigService,
  ) {
  }

  public createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.configService.get('MODE') === Mode.Dev
        ? `mongodb://${this.configService.get('MONGO_INITDB_ROOT_USERNAME')}:${this.configService.get('MONGO_INITDB_ROOT_PASSWORD')}@localhost:${this.configService.get('MONGO_PORT')}/${this.configService.get('MONGO_INITDB_DATABASE')}?authSource=admin${this.configService.get('MONGO_RS') ? '&replicaSet=' + this.configService.get('MONGO_RS') : ''}&ssl=false`
        : `mongodb://${this.configService.get('MONGO_INITDB_ROOT_USERNAME')}:${this.configService.get('MONGO_INITDB_ROOT_PASSWORD')}@localhost:${this.configService.get('MONGO_PORT')}/${this.configService.get('MONGO_INITDB_DATABASE')}`,
    };
  }
}
