import { Button, Stack } from '@chakra-ui/react';
import { useCart, useCartCalculatedMetrics, useProfile } from '@project-lc/hooks';
import { useCartStore, useKkshowOrder } from '@project-lc/stores';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

export function CartActions(): JSX.Element {
  const profile = useProfile();
  const router = useRouter();
  const { data } = useCart();
  const selectedItems = useCartStore((s) => s.selectedItems);
  const calculated = useCartCalculatedMetrics();

  const orderPrepare = useKkshowOrder((s) => s.handleOrderPrepare);
  // 주문 클릭시
  const handleOrderClick = useCallback((): void => {
    if (!data) return;
    orderPrepare({
      orderPrice: calculated.totalOrderPrice,
      giftFlag: false,
      nonMemberOrderFlag: !profile.data?.id,
      supportOrderIncludeFlag:
        data &&
        data
          .filter((cartItem) => selectedItems.includes(cartItem.id))
          .some((i) => i.support),
      // TODO: 비회원 주문 처리 작업 이후 수정 필요
      orderItems: data
        .filter((cartItem) => selectedItems.includes(cartItem.id))
        .map((i) => ({
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

    // 비회원 주문 로그인화면으로 이동, 로그인 이후 페이지를 주문페이지로
    if (!profile.data?.id) {
      router.push(`/login?from=purchase&nextpage=/payment`);
      return;
    }
    router.push('/payment');
  }, [
    calculated.totalOrderPrice,
    data,
    orderPrepare,
    profile.data?.id,
    router,
    selectedItems,
  ]);

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
