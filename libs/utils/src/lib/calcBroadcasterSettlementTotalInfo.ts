import { ExportItemWithMarketingMethod } from '@project-lc/shared-types';

export interface BroadcasterSettlementTotalInfo {
  price?: number;
  settleAmount?: number;
}

export const calcBroadcasterSettlementTotalInfo = (
  items: ExportItemWithMarketingMethod[],
): BroadcasterSettlementTotalInfo => {
  return items.reduce<BroadcasterSettlementTotalInfo>((prev, curr) => {
    let settleAmount = 0;
    if (curr.liveShopping) {
      settleAmount = Math.floor(
        Number(curr.price) * (Number(curr.liveShopping.broadcasterCommissionRate) / 100),
      );
    }
    if (curr.productPromotion) {
      settleAmount = Math.floor(
        Number(curr.price) *
          (Number(curr.productPromotion.broadcasterCommissionRate) / 100),
      );
    }

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
