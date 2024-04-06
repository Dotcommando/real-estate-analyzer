import { ICommercialContent } from './commercial-content.interface';
import { IPlotContent } from './plot-content.interface';
import { IResidentialContent } from './residential-content.interface';

import { Categories, CommercialType, Source } from '../../constants';


export interface IAd<T_id = string, TContent = IResidentialContent<T_id> | ICommercialContent<T_id> | IPlotContent<T_id>> {
  _id: T_id;
  ad_id: string;
  url: string;
  source: Source;
  updated_at: Date;
  ad_last_updated: Date;
  category: Categories;
  subcategory: string | CommercialType; // Ex 'plot-type' for plots
  content: TContent[];
  version: string;
}
