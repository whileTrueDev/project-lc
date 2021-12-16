import { useMemo } from 'react';
import {
  BroadcasterSettlementTarget,
  ExportItemWithLiveShopping,
} from '@project-lc/shared-types';

export interface BroadcasterTotalInfo {
  price?: number;
  settleAmount?: number;
}

export const calcBroadcasterSettlementTotalInfo = (
  items: ExportItemWithLiveShopping[],
): BroadcasterTotalInfo => {
  return items.reduce<BroadcasterTotalInfo>((prev, curr) => {
    const settleAmount = Math.floor(
      Number(curr.price) * (Number(curr.liveShopping.broadcasterCommissionRate) / 100),
    );

    if (!prev)
      return {
        price: Number(curr.price),
        settleAmount,
      };
    return {
      price: (prev.price || 0) + Number(curr.price),
      settleAmount: (prev.settleAmount || 0) + settleAmount,
    };
  }, {});
};

/** 방송인 정산 정보 */
export const useBroadcasterSettlementTotalInfo = (
  settlementTarget: BroadcasterSettlementTarget,
): BroadcasterTotalInfo => {
  return useMemo(
    () => calcBroadcasterSettlementTotalInfo(settlementTarget.items),
    [settlementTarget.items],
  );
};
