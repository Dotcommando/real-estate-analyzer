import { IResidentialContent } from './residential-content.interface';

import { Source } from '../../constants';


export interface IResidentialAd<T_id = string, TContent = IResidentialContent<T_id>> {
  _id: T_id;
  ad_id: string;
  url: string;
  source: Source;
  updated_at: Date;
  ad_last_updated: Date;
  content: TContent[];
  version: string;
}
