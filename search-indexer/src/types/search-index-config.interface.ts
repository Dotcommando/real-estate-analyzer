export interface ISearchIndexConfig {
  collections: string[]; // collection names with parsed ads.
  mapTo: string; // collection name with "sr_" prefix. "sr" means "Search Results".
}
