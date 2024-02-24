import { stripIds } from './strip-ids.mapper';

import { ISaleResidentialId, keysOfISaleResidentialId } from '../types';


export function toSaleResidentialIdMapper(doc: any): ISaleResidentialId {
  const mapped: any = {};

  keysOfISaleResidentialId.forEach((key: keyof ISaleResidentialId) => {
    if (key in doc) {
      if ((key === 'priceDeviations' || key === 'coords') && doc[key] !== null) {
        mapped[key] = stripIds(doc[key]);
      } else {
        mapped[key] = doc[key];
      }
    }
  });

  return mapped as ISaleResidentialId;
}
