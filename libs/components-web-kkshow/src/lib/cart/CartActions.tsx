import { Button, Stack, useToast } from '@chakra-ui/react';
import { SellType } from '@prisma/client';
import {
  useCart,
  useCartCalculatedMetrics,
  useLiveShoppingNowOnLive,
  useProductPromotions,
  useProfile,
} from '@project-lc/hooks';
import { CartItemRes } from '@project-lc/shared-types';
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

  const goodsIds = data?.map((cartItem) => cartItem.goodsId as number) || undefined;
  // 각 상품의 라이브쇼핑 정보
  const ls = useLiveShoppingNowOnLive({ goodsIds });

  // 각 상품의 상품홍보 정보
  const pp = useProductPromotions({ goodsIds });

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

  /** 장바구니 -> 주문시 판매유형 결정
   * 유입에 따른 처리 방식
    상품홍보페이지를 통해 유입된 경우
    상품이 라이브쇼핑중인 경우 - 라이브쇼핑
    라이브쇼핑중 카트에 담고, 향후 라이브쇼핑이 판매기간이 끝난 이후 주문하고자 하는 경우 - 상품홍보
    상품이 라이브쇼핑중이 아닌 경우 - 상품홍보
    카트에 담고, 향후 주문하고자 하는 데 (방송인/판매자/관리자 의지로) 상품홍보가 끝난 경우 - 기본판매
    방송인 선택 제거한 경우 - 기본판매
    상품홍보페이지를 통하지 않고 유입된 경우
    방송인 선택시 - 상품홍보
    방송인 선택 + 해당 상품이 라이브쇼핑중인 경우 - 라이브쇼핑
    방송인 선택 안한 경우 - 기본판매
   */
  const defineCorrectChannel = useCallback(
    (item: CartItemRes[number]): SellType => {
      let { channel } = item;
      // 현재 주문시 상품홍보중인 상품의 경우
      if (pp.data?.find((p) => p.broadcasterId === item.support?.broadcasterId)) {
        channel = SellType.productPromotion;
      } else {
        // 상품홍보중인 상품을 장바구니에 담았으니, 현재 주문시 상품홍보중이 아닌 경우
        channel = SellType.normal;
      }

      const liveShoppingOnLive = ls.data?.find(
        (x) =>
          x.goodsId === item.goodsId && x.broadcasterId === item.support?.broadcasterId,
      );
      // 현재 판매 진행중인 support 방송인의 라이브쇼핑이 있는 경우
      if (liveShoppingOnLive) channel = SellType.liveShopping;
      // 라이브쇼핑 기간동안 장바구니담았으나, 주문시 라이브쇼핑 판매기간이 지난경우
      if (
        !liveShoppingOnLive &&
        channel === 'liveShopping' &&
        item.support?.broadcasterId
      ) {
        channel = SellType.productPromotion;
        // 근데 상품홍보가 끝난 경우
        if (
          !(
            pp.data &&
            pp.data.find((p) => p.broadcasterId === item.support?.broadcasterId)
          )
        ) {
          channel = SellType.normal;
        }
      }
      return channel;
    },
    [ls.data, pp.data],
  );

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
          channel: defineCorrectChannel(i), // 판매유형 결정
          shippingCostIncluded: i.shippingCostIncluded, // 다른 상품에 이미 배송비가 포함되었는 지 여부
          support: i.support
            ? {
                broadcasterId: i.support.id,
                message: i.support.message || '',
                nickname: i.support.broadcaster.userNickname,
                avatar: i.support.broadcaster.avatar,
                liveShoppingId: i.support.liveShoppingId || undefined,
                productPromotionId: i.support.productPromotionId || undefined,
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
    defineCorrectChannel,
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
