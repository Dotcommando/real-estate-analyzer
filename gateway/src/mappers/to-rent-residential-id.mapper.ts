import { IRentResidentialId, keysOfIRentResidentialId } from '../types';


export function toRentResidentialIdMapper(doc: any): IRentResidentialId {
  const mapped: any = {};

  keysOfIRentResidentialId.forEach((key: keyof IRentResidentialId) => {
    if (key in doc) {
      mapped[key] = doc[key];
    }
  });

  return mapped as IRentResidentialId;
}
