import { ISaleResidentialId, keysOfISaleResidentialId } from '../types';


export function toSaleResidentialIdMapper(doc: any): ISaleResidentialId {
  const mapped: any = {};

  keysOfISaleResidentialId.forEach((key: keyof ISaleResidentialId) => {
    if (key in doc) {
      mapped[key] = doc[key];
    }
  });

  return mapped as ISaleResidentialId;
}
