import { IRentCommercialProperty } from '../rent-property';


export interface IRentCommercials extends IRentCommercialProperty {
  type?: string;
  'property-area': number;
  'property-area-unit': 'm²';
  'plot-area': number;
  'plot-area-unit': 'm²';
}
