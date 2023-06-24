import { PlotType, Share } from '../../constants';
import { IRealEstate } from '../real-estate';


export interface ISalePlots extends IRealEstate {
  'plot-area': number;
  'plot-area-unit': 'm²';
  'plot-type': PlotType;
  share?: Share;
  'planning-zone'?: string;
  'square-meter-price': number;
  density?: string;
  coverage?: string;
  'parcel-number'?: string;
}
