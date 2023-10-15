import { SearchParam } from '../constants/search-param.constant';

export function getSearchParam(key: SearchParam): string | null {
  const params = new URLSearchParams(document.location.search);

  return params.get(key);
}
