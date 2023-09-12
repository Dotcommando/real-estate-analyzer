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
  // eslint-disable-next-line class-methods-use-this
  private get baseUrl() {
    return `${process.env.REACT_APP_BASE_API_URL}`;
  }

  public get<Response, Params, Config = unknown>(
    url: string,
    params?: Params,
    options?: AxiosRequestConfig,
  ): Promise<AxiosResponse<Response, Config>> {
    return axios
      .request<Response>({
        url: `${this.baseUrl}${url}`,
        method: 'get',
        params: mapObjectKeysToCase('snake', params),
        ...options,
      })
      .then(translateResponseKeysToCamel);
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
