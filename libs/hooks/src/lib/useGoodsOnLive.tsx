import { Broadcaster, Goods } from '@prisma/client';
import {
  getLiveShoppingProgress,
  GoodsByIdRes,
  SpecialPriceItem,
} from '@project-lc/shared-types';
import { useMemo } from 'react';
import { useLiveShoppingNowOnLive } from './queries/useLiveShoppingList';

/** 해당 상품에 대해 라이브쇼핑 연결 여부 리턴 */
export const useGoodsOnLiveFlag = (goods: GoodsByIdRes): boolean => {
  const onLiveShopping = useMemo(() => {
    if (!goods || !goods.LiveShopping || goods.LiveShopping.length === 0) return false;
    // 모든 데이터가 '판매종료', '취소됨' 상태가 아니라면 라이브쇼핑 진행중으로 봄
    const liveShoppingIng = !goods.LiveShopping.every((live) => {
      const liveShoppingProgress = getLiveShoppingProgress(live);
      return ['판매종료', '취소됨'].includes(liveShoppingProgress);
    });
    return liveShoppingIng;
  }, [goods]);
  return onLiveShopping;
};

/** 해당 상품에 대해 라이브쇼핑 실제 판매 진행중인지 여부 리턴 */
export const useIsThisGoodsNowOnLive = (
  goodsId?: Goods['id'],
  broadcasterId?: Broadcaster['id'],
): boolean => {
  const liveShopping = useLiveShoppingNowOnLive({
    goodsId,
    broadcasterId,
  });
  const isNowLive = useMemo(
    () => liveShopping.data?.some((li) => li.goodsId === goodsId),
    [goodsId, liveShopping.data],
  );
  return !!isNowLive;
};

/** 해당 상품에 대해 특정 방송인이 진행중인 라이브쇼핑이 있는 경우 해당 라이브방송의 특가정보 리턴
 * 없으면 undefined
 */
export const useLiveShoppingSpecialPriceListNowOnLiveByBroadcaster = (
  goodsId?: Goods['id'],
  broadcasterId?: Broadcaster['id'],
): SpecialPriceItem[] | undefined => {
  const { data: onLiveLsList } = useLiveShoppingNowOnLive({
    goodsId,
    broadcasterId,
  });

  const specialPriceItemList = useMemo(() => {
    if (
      onLiveLsList &&
      onLiveLsList.length &&
      onLiveLsList[0].liveShoppingSpecialPrices.length
    ) {
      return onLiveLsList[0].liveShoppingSpecialPrices; // 특정방송인이 같은 시간대에 동일한상품을 라이브판매 진행하는 경우는 없으므로 항상 첫번째값을 확인
    }
    return undefined;
  }, [onLiveLsList]);
  return specialPriceItemList;
};
