import { Button, Stack, useToast } from '@chakra-ui/react';
import { useCart, useCartCalculatedMetrics, useProfile } from '@project-lc/hooks';
import { useCartStore, useKkshowOrderStore } from '@project-lc/stores';
import { checkGoodsPurchasable } from '@project-lc/utils-frontend';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

export function CartActions(): JSX.Element {
  const toast = useToast({ isClosable: true });
  const profile = useProfile();
  const router = useRouter();
  const { data } = useCart();
  const selectedItems = useCartStore((s) => s.selectedItems);
  const calculated = useCartCalculatedMetrics();

  // 장바구니 선택된 상품 주문하기 실행 전 올바른 주문인지 체크함수
  const executePurchaseCheck = useCallback((): boolean => {
    if (!data || data.length === 0 || selectedItems.length === 0) return false;
    const selectedCartItems = data.filter((d) => selectedItems.includes(d.id));
    return selectedCartItems.every((i) => {
      // 최대/최소 주문 개수 제한 체크
      const totalOptsQuantity = i.options.reduce((prev, curr) => prev + curr.quantity, 0);
      return checkGoodsPurchasable(i.goods, totalOptsQuantity, {
        onMaxLimitFail: () =>
          toast({
            title: `${i.goods.goods_name}`,
            description: `최대 주문 수량(${i.goods.max_purchase_ea}개)까지 구매가능합니다.`,
            status: 'warning',
          }),
        onMinLimitFail: () =>
          toast({
            title: `${i.goods.goods_name}`,
            description: `최소 주문 수량(${i.goods.min_purchase_ea}개)이상 구매해야 합니다.`,
            status: 'warning',
          }),
      });
    });
  }, [data, selectedItems, toast]);

  // 주문 클릭시
  const orderPrepare = useKkshowOrderStore((s) => s.handleOrderPrepare);
  const handleOrderClick = useCallback((): void => {
    if (!data) return;
    if (!executePurchaseCheck()) return;

    orderPrepare({
      orderPrice: calculated.totalOrderPrice,
      giftFlag: false,
      nonMemberOrderFlag: !profile.data?.id,
      supportOrderIncludeFlag: data
        .filter((cartItem) => selectedItems.includes(cartItem.id))
        .some((i) => i.support),
      orderItems: data
        .filter((cartItem) => selectedItems.includes(cartItem.id))
        .map((i) => ({
          goodsName: i.goods.goods_name,
          goodsId: i.goods.id,
          options: i.options.map((o) => ({
            ...o,
            goodsOptionId: o.goodsOptionsId as number,
          })),
          shippingCost: i.shippingCost,
          shippingGroupId: i.shippingGroupId || 1,
          // TODO: 유입 채널 경로 파악 기능 구현 이후 수정 필요
          channel: 'normal',
          shippingCostIncluded: i.shippingCostIncluded, // 다른 상품에 이미 배송비가 포함되었는 지 여부
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
    executePurchaseCheck,
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
