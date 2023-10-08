import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  RawAxiosRequestHeaders,
} from 'axios';

import { mapObjectKeysToCase } from '../../utils/string.util';

const translateResponseKeysToCamel = (
  response: AxiosResponse,
): AxiosResponse => ({
  ...response,
  data: mapObjectKeysToCase('camel', response.data),
});

export class BaseApi {
  private readonly protocol = process.env.REACT_APP_ORIGIN_PROTOCOL;

  private readonly host = process.env.REACT_APP_ORIGIN_HOST;

  // eslint-disable-next-line class-methods-use-this
  private get port(): string {
    return process.env.REACT_APP_ORIGIN_PORT &&
      process.env.REACT_APP_ORIGIN_PORT !== '80'
      ? `:${process.env.REACT_APP_ORIGIN_PORT}`
      : '';
  }

  private readonly apiPrefix = process.env.REACT_APP_API_PREFIX;

  // eslint-disable-next-line class-methods-use-this
  private get baseUrl() {
    // return process.env.REACT_APP_BASE_API_URL;
    return `${this.protocol}://${this.host}${this.port}`;
  }

  public get<Response, Params>(
    url: string,
    params?: Params,
    options?: AxiosRequestConfig,
  ): Promise<Response> {
    return axios
      .request<{ data: Response }>({
        url: `${this.baseUrl}${this.apiPrefix}${url}`,
        method: 'get',
        params: mapObjectKeysToCase('snake', params),
        ...options,
      })
      .then(translateResponseKeysToCamel)
      .then(
        (response: AxiosResponse<{ data: Response }>) => response.data.data,
      );
  }

  public post<Response, Body, Config = unknown>(
    url: string,
    data: Body,
    headers: RawAxiosRequestHeaders,
  ): Promise<AxiosResponse<Response, Config>> {
    return axios
      .request<Response>({
        url: `${this.baseUrl}${url}`,
        method: 'post',
        data: mapObjectKeysToCase('snake', data),
        headers,
      })
      .then(translateResponseKeysToCamel);
  }
}
