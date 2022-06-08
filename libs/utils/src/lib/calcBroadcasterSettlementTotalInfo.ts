import { LiveShopping, Prisma, ProductPromotion } from '@prisma/client';
import { ExportItemWithMarketingMethod } from '@project-lc/shared-types';

export interface BroadcasterSettlementTotalInfo {
  price?: number;
  settleAmount?: number;
}

/** @deprecated */
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

export interface BcSettlementTotalInfo {
  total?: number;
  settleAmount?: number;
}

/** 방송인 정산 금액 (총 출고금액, 총 정산금액) 계산함수 */
export const calcBcSettlementTotalInfo = (target: {
  items: {
    orderItem: {
      support: { liveShopping: LiveShopping; productPromotion: ProductPromotion };
    };
    orderItemOption: {
      quantity: number;
      normalPrice: Prisma.Decimal;
      discountPrice: Prisma.Decimal;
    };
  }[];
}): BcSettlementTotalInfo => {
  return target.items.reduce<BcSettlementTotalInfo>((prev, curr) => {
    const itemPrice = Number(curr.orderItemOption.discountPrice);
    let settleAmount = curr.orderItemOption.quantity * itemPrice;

    if (curr.orderItem.support.liveShopping) {
      settleAmount = Math.floor(
        settleAmount *
          (Number(curr.orderItem.support.liveShopping.broadcasterCommissionRate) / 100),
      );
    }
    if (curr.orderItem.support.productPromotion) {
      settleAmount = Math.floor(
        settleAmount *
          (Number(curr.orderItem.support.productPromotion.broadcasterCommissionRate) /
            100),
      );
    }

    if (!prev) return { total: settleAmount, settleAmount };
    return {
      total: (prev.total || 0) + itemPrice,
      settleAmount: (prev.settleAmount || 0) + settleAmount,
    };
  }, {});
};
