import { PlotType, Share } from '../../constants';
import { IRealEstate } from '../real-estate';


export interface IRentPlots extends IRealEstate {
  'plot-area': number;
  'plot-area-unit': 'm²';
  'plot-type': PlotType;
  share?: Share;
  'parcel-number'?: string;
  'planning-zone'?: string;
  density?: string;
  coverage?: string;
}
