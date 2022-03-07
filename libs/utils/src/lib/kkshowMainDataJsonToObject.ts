import { KkshowMain, Prisma } from '@prisma/client';
import {
  KkshowMainResData,
  KkshowMainCarouselItem,
  KkShowMainLiveTrailer,
  KkshowMainBestLiveItem,
  KkshowMainBestBroadcasterItem,
  KkshowMainDto,
} from '@project-lc/shared-types';

/** JSON데이터인 value를 특정 타입으로 캐스팅하여 반환 */
export const parseJsonToGenericType = <T>(value: JSON | Prisma.JsonValue): T => {
  return JSON.parse(JSON.stringify(value));
};

/** 크크쇼메인데이터(KkshowMain) 을 KkshowMainResData 반환타입으로 캐스팅 */
export const kkshowMainJsonToResType = (data: KkshowMain): KkshowMainResData => {
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

/** 크크쇼메잍데이터(js 객체형태)를 KkshowMain dto 형태로 변환 */
export const kkshowDataToDto = (data: KkshowMainResData): KkshowMainDto => {
  return {
    carousel: data.carousel.map((c) => JSON.parse(JSON.stringify(c))),
    trailer: JSON.parse(JSON.stringify(data.trailer)),
    bestLive: data.bestLive.map((l) => JSON.parse(JSON.stringify(l))),
    bestBroadcaster: data.bestBroadcaster.map((b) => JSON.parse(JSON.stringify(b))),
  };
};
