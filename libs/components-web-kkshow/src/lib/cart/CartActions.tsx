import { Button, Stack, useToast } from '@chakra-ui/react';
import {
  useCart,
  useCartCalculatedMetrics,
  useCartShippingGroups,
  useProfile,
} from '@project-lc/hooks';
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

  // 배송그룹별 선택된 카트아이템 Record<배송그룹id, 선택된 카트상품id[]>
  // 배송그룹별 표시될 배송비(selectedItems, 배송그룹정보) => 배송비 Record<배송그룹id, 부과되는 배송비 정보(기본, 추가)>
  const { groupedSelectedItems, totalShippingCostObjectById } = useCartShippingGroups();

  // 주문 클릭시
  const orderPrepare = useKkshowOrderStore((s) => s.handleOrderPrepare);
  const setShippingData = useKkshowOrderStore((s) => s.setShippingData);
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
          // TODO: 유입 채널 경로 파악 기능 구현 이후 수정 필요
          channel: 'normal',
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
    groupedSelectedItems,
    orderPrepare,
    profile.data?.id,
    router,
    selectedItems,
    setShippingData,
    totalShippingCostObjectById,
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
