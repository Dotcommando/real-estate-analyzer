import { IRentResidentialContent } from './rent-residential-content.interface';

import { Source } from '../../constants';


export interface IRentResidentialAd<T_id = string, TContent = IRentResidentialContent<T_id>> {
  _id: T_id;
  ad_id: string;
  url: string;
  source: Source;
  updated_at: Date;
  ad_last_updated: Date;
  content: TContent[];
}
