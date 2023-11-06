import { RealEstateObject } from '../../../types/real-estate.type';
import { BaseApi } from '../../api/base.api';
import { AdsQueryParams } from '../types/ads.types';

class AdsApi extends BaseApi {
  public getAds(params: AdsQueryParams): Promise<RealEstateObject[]> {
    return this.get<RealEstateObject[], AdsQueryParams>('/ads', params).then(
      (x) => {
        return x.map((df: RealEstateObject) => {
          if (!df.district) {
            return df;
          }

          df.fullDistrict = df.district;

          // Замена сокращений
          df.district = df.district
            .replace(/Ag /g, 'Ag. ')
            .replace(/Agios /g, 'Ag. ')
            .replace(/Agia /g, 'Ag. ')
            .replace(/Apostolos /g, 'Ap. ')
            .replace(/Ap /g, 'Ap. ')
            .replace(/Panag /g, 'Panag. ');

          // Удаляем "Tourist Area"
          df.district = df.district.replace(/ Tourist Area/g, '');

          // Обрабатываем скобки
          df.district = df.district.replace(/\((.*?)\)/g, ' - $1');

          // Обрабатываем специфические случаи
          df.district = df.district
            .replace('Timiou Prodromou  Mesa Geitonias', 'Mesa Geitonia')
            .replace('Strovolos - ', '')
            .replace('Egkomi -', '');

          // Заменяем тире с любым количеством пробелов вокруг на " - "
          df.district = df.district.replace(/\s*-\s*/g, ' - ');

          // Разделяем двойные районы
          df.district = df.district.split(' - ').join();

          // Обрабатываем "Arch Makarios III"
          df.district = df.district.replace(
            /^(Makarios III|Arch Makarios III)$/,
            'Arch. Makarios III',
          );

          return df;
        });
      },
    );
  }
}

export const adsApi = new AdsApi();
