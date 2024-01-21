import { ISaleProperty } from '../sale-property.interface';


export interface ISaleCommercials extends ISaleProperty {
  type?: string;
  area: number;
  'area-unit': 'm²';
  'plot-area': number;
  'plot-area-unit': 'm²';
}
