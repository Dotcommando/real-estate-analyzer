export interface ICategoryData {
  paginationUrls: Set<string>;
  adsUrls: Set<string>;
}

export interface ICategoriesData {
  [path: string]: ICategoryData;
}
