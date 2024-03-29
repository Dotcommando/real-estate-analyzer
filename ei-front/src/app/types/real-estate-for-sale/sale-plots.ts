import { Share } from '../../constants';
import { IRealEstate } from '../real-estate.interface';


export interface ISalePlots extends IRealEstate {
  'plot-area': number;
  'plot-area-unit': 'm²';
  'plot-type': string;
  share?: Share;
  'planning-zone'?: string;
  density?: string;
  coverage?: string;
  'parcel-number'?: string;
}
