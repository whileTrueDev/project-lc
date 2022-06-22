import { Button, Stack, useToast } from '@chakra-ui/react';
import { SellType } from '@prisma/client';
import {
  useCart,
  useCartCalculatedMetrics,
  useCartShippingGroups,
  useLiveShoppingNowOnLive,
  useProductPromotions,
  useProfile,
} from '@project-lc/hooks';
import { CartItemRes } from '@project-lc/shared-types';
import { OrderShippingData, useCartStore, useKkshowOrderStore } from '@project-lc/stores';
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
  // 배송그룹별 선택된 카트아이템 Record<배송그룹id, 선택된 카트상품id[]>
  // 배송그룹별 표시될 배송비(selectedItems, 배송그룹정보) => 배송비 Record<배송그룹id, 부과되는 배송비 정보(기본, 추가)>
  const {
    groupedSelectedItems,
    totalShippingCostObjectById,
    shippingGroupIdList,
    shippingGroupWithShopNameObject,
  } = useCartShippingGroups();

  // 주문 클릭시
  const orderPrepare = useKkshowOrderStore((s) => s.handleOrderPrepare);
  const setShippingData = useKkshowOrderStore((s) => s.setShippingData);
  const setShopNames = useKkshowOrderStore((s) => s.setShopNames);
  const handleOrderClick = useCallback((): void => {
    if (!data) return;
    if (!executePurchaseCheck()) return;

    // kkshowOrderStore에 배송비정보 저장
    const groupIdList = Object.keys(groupedSelectedItems).map((id) => Number(id));

    let shippingData: OrderShippingData = {};
    groupIdList.forEach((id) => {
      shippingData = {
        ...shippingData,
        [id]: {
          items: data // cartId가 아닌 goodsId 저장 (주문페이지에는 카트id정보가 없음)
            .filter((cartItem) => groupedSelectedItems[id].includes(cartItem.id))
            .map((cartItem) => cartItem.goods.id),
          cost: totalShippingCostObjectById[id],
          isShippingAvailable: true, // 장바구니 페이지에서는 주소정보가 없어서 일단 true로 넘김
        },
      };
    });
    setShippingData(shippingData);

    // 상점명 저장
    const shopNames = shippingGroupIdList.map((shippingGroupId) => {
      return shippingGroupWithShopNameObject[shippingGroupId].shopName || '';
    });
    setShopNames(shopNames);

    // kkshowOrderStore에 주문정보 저장
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
          options: i.options.map((o) => {
            // CartOptionItem 타입에서 CreateOrderItemOptionDto 타입 만들기 위해 필요한 데이터만 사용
            const { cartItemId, goodsOptionsId, id, ...optData } = o;
            return {
              ...optData,
              normalPrice: Number(o.normalPrice),
              discountPrice: Number(o.discountPrice),
              goodsOptionId: o.goodsOptionsId as number,
            };
          }),
          shippingGroupId: i.shippingGroupId || 1,
          channel: defineCorrectChannel(i), // 판매유형 결정
          support: i.support
            ? {
                broadcasterId: i.support.broadcasterId,
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
    groupedSelectedItems,
    orderPrepare,
    profile.data?.id,
    router,
    selectedItems,
    setShippingData,
    totalShippingCostObjectById,
    setShopNames,
    shippingGroupIdList,
    shippingGroupWithShopNameObject,
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
