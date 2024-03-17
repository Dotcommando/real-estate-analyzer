import { Share } from '../../constants';
import { IRealEstate } from '../real-estate.interface';


export interface IRentPlots extends IRealEstate {
  'plot-area': number;
  'plot-area-unit': 'm²';
  'plot-type': string;
  share?: Share;
  'parcel-number'?: string;
  'planning-zone'?: string;
  density?: string;
  coverage?: string;
}
