import { CommercialType } from '../../constants';
import { ISaleProperty } from '../sale-property';


export interface ISaleCommercial extends ISaleProperty {
  type?: CommercialType;
  area: number;
  'area-unit': 'm²';
  'plot-area': number;
  'plot-area-unit': 'm²';
}
