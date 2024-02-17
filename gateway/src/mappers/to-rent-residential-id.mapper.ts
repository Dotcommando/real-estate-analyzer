import { stripIds } from './strip-ids.mapper';

import { IRentResidentialId, keysOfIRentResidentialId } from '../types';


export function toRentResidentialIdMapper(doc: any): IRentResidentialId {
  const mapped: any = {};

  keysOfIRentResidentialId.forEach((key: keyof IRentResidentialId) => {
    if (key in doc) {
      if (key === 'priceDeviations' && doc[key] !== null) {
        mapped[key] = stripIds(doc[key]);
      } else {
        mapped[key] = doc[key];
      }
    }
  });

  return mapped as IRentResidentialId;
}
