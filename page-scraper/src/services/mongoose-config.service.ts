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

  private username = this.configService.get('MONGO_INITDB_ROOT_USERNAME');
  private password = this.configService.get('MONGO_INITDB_ROOT_PASSWORD');
  private database = this.configService.get('MONGO_INITDB_DATABASE');
  private protocol = this.configService.get('MONGO_PROTOCOL')
    ? this.configService.get('MONGO_PROTOCOL')
    : 'mongodb';
  private host = this.configService.get('MONGO_HOST');
  private port = this.configService.get('MONGO_PORT')
    ? ':' + this.configService.get('MONGO_PORT')
    : '';
  private queryParamReplicaSet = this.configService.get('MONGO_RS')
    ? '&replicaSet=' + this.configService.get('MONGO_RS')
    : '';
  private queryParamRetryWrites = this.configService.get('MONGO_RETRY_WRITES') === 'true'
    ? '&retryWrites=' + this.configService.get('MONGO_RETRY_WRITES')
    : '';
  private queryParamW = this.configService.get('MONGO_W')
    ? '&w=' + this.configService.get('MONGO_W')
    : '';
  private queryParamStringExists = Boolean(this.queryParamReplicaSet) || Boolean(this.queryParamRetryWrites) || Boolean(this.queryParamW);
  private queryString = this.queryParamStringExists
    ? `${this.queryParamReplicaSet}${this.queryParamRetryWrites}${this.queryParamW}`.replace(/^&/, '?')
    : '';

  public createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: `${this.protocol}://${this.username}:${this.password}@${this.host}${this.port}${this.queryString}`,
    };
  }
}
