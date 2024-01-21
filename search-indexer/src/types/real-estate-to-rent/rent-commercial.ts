import { IRentProperty } from '../rent-property.interface';


export interface IRentCommercials extends IRentProperty {
  type?: string;
  'property-area': number;
  'property-area-unit': 'm²';
  'plot-area': number;
  'plot-area-unit': 'm²';
}
