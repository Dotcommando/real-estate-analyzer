import { IRentResidentialId, ISaleResidentialId } from '../types';


export const EMPTY_SEARCH_RESULT: { data: ISaleResidentialId[]; total: number } | { data: IRentResidentialId[]; total: number } = {
  total: 0,
  data: [],
};
