import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';


@Injectable()
export class MongoConfigService implements MongooseOptionsFactory {
  constructor(
    private readonly configService: ConfigService,
  ) {
  }

  public createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: `mongodb://${this.configService.get('MONGO_INITDB_ROOT_USERNAME')}:${this.configService.get('MONGO_INITDB_ROOT_PASSWORD')}@localhost:${this.configService.get('MONGO_PORT')}/${this.configService.get('MONGO_INITDB_DATABASE')}?authSource=admin&replicaSet=rs0&ssl=false`,
    };
  }
}
