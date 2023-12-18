import { ISaleCommercialProperty } from '../sale-property';


export interface ISaleCommercials extends ISaleCommercialProperty {
  type?: string;
  area: number;
  'area-unit': 'm²';
  'plot-area': number;
  'plot-area-unit': 'm²';
}
