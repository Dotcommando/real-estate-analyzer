import { AdsResponse, RealEstateObject } from '../../../types/real-estate.type';
import { BaseApi } from '../../api/base.api';
import { AdsQueryParams } from '../types/ads.types';

class AdsApi extends BaseApi {
  public getAds(params: AdsQueryParams): Promise<AdsResponse> {
    return this.get<AdsResponse, AdsQueryParams>('/ads', params).then(
      (response) => {
        response.ads = response.ads.map((df: RealEstateObject) => {
          if (!df.district) {
            return df;
          }

          df.fullDistrict = df.district;

          // Обрабатываем специфические случаи
          df.district = df.district.replace(
            /Timiou Prodromou\s+Mesa Geitonias/g,
            'Mesa Geitonia',
          );

          if (/\s+-\s+/.test(df.district)) {
            // eslint-disable-next-line prefer-destructuring
            df.district = df.district.split(/\s+-\s+/)[1];
          }

          // Удаляем "Tourist Area"
          df.district = df.district.replace(/ Tourist Area/g, '');

          // Замена сокращений
          df.district = df.district
            .replace(/Ag /g, 'Ag. ')
            .replace(/Agios /g, 'Ag. ')
            .replace(/Agia /g, 'Ag. ')
            .replace(/Apostolos /g, 'Ap. ')
            .replace(/Ap /g, 'Ap. ')
            .replace(/Panag /g, 'Panag. ');

          // Обрабатываем скобки
          df.district = df.district.replace(/\((.*?)\)/g, ' - $1');

          // Обрабатываем "Arch Makarios III"
          df.district = df.district.replace(
            /^(Makarios III|Arch Makarios III)$/,
            'Arch. Makarios III',
          );

          return df;
        });

        return response;
      },
    );
  }
}

export const adsApi = new AdsApi();
