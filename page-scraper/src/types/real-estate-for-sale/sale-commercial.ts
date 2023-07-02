import { ISaleProperty } from '../sale-property';


export interface ISaleCommercial extends ISaleProperty {
  type?: string;
  area: number;
  'area-unit': 'm²';
  'plot-area': number;
  'plot-area-unit': 'm²';
}
