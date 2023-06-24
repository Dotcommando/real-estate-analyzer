import { CommercialType } from '../../constants';
import { IRentProperty } from '../rent-property';


export interface IRentCommercial extends IRentProperty {
  type?: CommercialType;
  'property-area': number;
  'property-area-unit': 'm²';
  'plot-area': number;
  'plot-area-unit': 'm²';
}
