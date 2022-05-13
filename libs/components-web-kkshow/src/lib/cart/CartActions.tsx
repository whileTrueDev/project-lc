import { Button, Stack } from '@chakra-ui/react';
import { useCart } from '@project-lc/hooks';
import { useCartStore, useKkshowOrder } from '@project-lc/stores';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

export function CartActions(): JSX.Element {
  const router = useRouter();
  const { selectedItems } = useCartStore();
  const { data } = useCart();

  const calculated = useMemo(() => {
    return selectedItems.reduce(
      (prev, item) => {
        const itemprice = item.options.reduce(
          (p, n) => p + Number(n.normalPrice) * n.quantity,
          0,
        );
        const orderPrice = item.options.reduce(
          (p, n) => p + Number(n.discountPrice) * n.quantity,
          0,
        );
        return {
          totalGoodsPrice: prev.totalGoodsPrice + itemprice,
          totalShippingCost: prev.totalShippingCost + Number(item.shippingCost),
          totalOrderPrice: prev.totalOrderPrice + orderPrice,
          totalDiscountAmount: prev.totalDiscountAmount + (itemprice - orderPrice),
        };
      },
      {
        totalGoodsPrice: 0,
        totalDiscountAmount: 0,
        totalShippingCost: 0,
        totalOrderPrice: 0,
      },
    );
  }, [selectedItems]);

  const orderPrepare = useKkshowOrder((s) => s.handleOrderPrepare);
  // 주문 클릭시
  const handleOrderClick = useCallback((): void => {
    orderPrepare({
      orderPrice: calculated.totalOrderPrice,
      giftFlag: false,
      supportOrderIncludeFlag: selectedItems.some((i) => i.support),
      // TODO: 비회원 주문 처리 작업 이후 수정 필요
      nonMemberOrderFlag: false,
      orderItems: selectedItems.map((i) => ({
        goodsName: i.goods.goods_name,
        goodsId: i.goods.id,
        options: i.options.map((o) => ({
          ...o,
          goodsOptionId: o.goodsOptionsId as number,
        })),
        // TODO: 상품 배송비 판단 로직 이후 수정 필요
        shippingCost: '2500',
        shippingGroupId: i.shippingGroupId || 1,
        // TODO: 유입 채널 경로 파악 기능 구현 이후 수정 필요
        channel: 'normal',
        shippingCostIncluded: false, // 다른 상품에 이미 배송비가 포함되었는 지 여부
        support: i.support
          ? {
              broadcasterId: i.support.id,
              message: i.support.message || '',
              nickname: i.support.broadcaster.userNickname,
              avatar: i.support.broadcaster.avatar,
            }
          : undefined,
      })),
    });
    router.push('/payment');
  }, [calculated.totalOrderPrice, orderPrepare, router, selectedItems]);

  return (
    <Stack>
      <Button
        size="lg"
        isFullWidth
        colorScheme="blue"
        onClick={handleOrderClick}
        isDisabled={!data || !!(data.length === 0) || selectedItems.length <= 0}
      >
        선택상품 주문하기
      </Button>
      <Button
        size="lg"
        isFullWidth
        variant="outline"
        onClick={() => router.push('/shopping')}
      >
        계속 쇼핑하기
      </Button>
    </Stack>
  );
}

export default CartActions;
