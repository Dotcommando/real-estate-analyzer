import { IDistrictStats } from './district-stats.interface';


export interface IGetDistrictsResult {
  city: string;
  districts: ({ district: string } & IDistrictStats)[];
}

