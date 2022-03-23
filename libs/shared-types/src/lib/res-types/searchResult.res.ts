export interface SearchResultItem {
  imageUrl: string;
  linkUrl: string;
  title: string;
}

export interface SearchResult {
  goods: SearchResultItem[];
  liveContents: SearchResultItem[];
  broadcasters: SearchResultItem[];
}
