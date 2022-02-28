import { KkshowMainBestBroadcasterItem } from './bestBroadcaster';
import { KkshowMainBestLiveItem } from './bestLive';
import { KkshowMainCarouselItem } from './carouselItem';
import { KkShowMainLiveTrailer } from './liveTrailer';

export * from './carouselItem';
export * from './liveTrailer';
export * from './bestLive';
export * from './bestBroadcaster';

export interface KkshowMainResData {
  carousel: KkshowMainCarouselItem[];
  trailer: KkShowMainLiveTrailer;
  bestLive: KkshowMainBestLiveItem[];
  bestBroadcaster: KkshowMainBestBroadcasterItem[];
}
