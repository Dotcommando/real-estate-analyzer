import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, ClientProxy, ClientProxyFactory, TcpOptions, Transport } from '@nestjs/microservices';


@Injectable()
export class ProxyFactory {
  private clientProxy: ClientProxy;

  constructor(
    private readonly configService: ConfigService,
  ) {
  }

  public getClientProxy(): ClientProxy {
    if (!this.clientProxy) {
      const host = this.configService.get<string>('WEB_SCRAPER_SERVICE_HOST');
      const port = parseInt(this.configService.get<string>('WEB_SCRAPER_SERVICE_PORT'));

      const options: TcpOptions = {
        transport: Transport.TCP,
        options: {
          host,
          port,
        },
      };

      this.clientProxy = ClientProxyFactory.create(options as ClientOptions);
    }

    return this.clientProxy;
  }
}
