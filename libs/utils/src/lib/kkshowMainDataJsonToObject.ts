import { KkshowMain, Prisma } from '@prisma/client';
import {
  KkshowMainResData,
  KkshowMainCarouselItem,
  KkShowMainLiveTrailer,
  KkshowMainBestLiveItem,
  KkshowMainBestBroadcasterItem,
} from '@project-lc/shared-types';

/** JSON데이터인 value를 특정 타입으로 캐스팅하여 반환 */
export const parseJsonToGenericType = <T>(value: JSON | Prisma.JsonValue): T => {
  return JSON.parse(JSON.stringify(value));
};

/** 크크쇼메인데이터(JSON타입) 을 KkshowMainResData 반환타입으로 캐스팅 */
export const jsonToResType = (data: KkshowMain): KkshowMainResData => {
  const carousel = parseJsonToGenericType<KkshowMainCarouselItem[]>(data.carousel);
  const trailer = parseJsonToGenericType<KkShowMainLiveTrailer>(data.trailer);
  const bestLive = parseJsonToGenericType<KkshowMainBestLiveItem[]>(data.bestLive);
  const bestBroadcaster = parseJsonToGenericType<KkshowMainBestBroadcasterItem[]>(
    data.bestBroadcaster,
  );
  return {
    carousel,
    trailer,
    bestLive,
    bestBroadcaster,
  };
};
