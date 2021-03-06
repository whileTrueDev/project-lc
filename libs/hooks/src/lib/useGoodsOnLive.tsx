import { Broadcaster, Goods } from '@prisma/client';
import { getLiveShoppingProgress, GoodsByIdRes } from '@project-lc/shared-types';
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
