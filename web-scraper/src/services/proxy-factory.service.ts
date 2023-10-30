import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, ClientProxy, ClientProxyFactory, TcpOptions, Transport } from '@nestjs/microservices';


@Injectable()
export class ProxyFactoryService {
  private clientProxyMap = new Map<string, ClientProxy>();

  constructor(
    private readonly configService: ConfigService,
  ) {
  }

  public getClientProxy(host: string, port: string | number): ClientProxy {
    const key = host + ':' + port;

    if (!this.clientProxyMap.has(key)) {
      const options: TcpOptions = {
        transport: Transport.TCP,
        options: {
          host,
          port: typeof port === 'number' ? port : parseInt(port),
        },
      };

      const clientProxy = ClientProxyFactory.create(options as ClientOptions);

      this.clientProxyMap.set(key, clientProxy);

      return clientProxy;
    }

    return this.clientProxyMap.get(key);
  }
}
