import { Button, SimpleGrid, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { ReviewCreateDialog } from '@project-lc/components-shared/goods-review/ReviewCreateDialog';
import { useOrderPurchaseConfirmMutation } from '@project-lc/hooks';
import {
  deliveryTrackingAbleSteps,
  exchangeReturnAbleSteps,
  inquireDisableSteps,
  orderCancellationAbleSteps,
  purchaseConfirmAbleSteps,
  reviewAbleSteps,
} from '@project-lc/shared-types';
import { useRouter } from 'next/router';
import { OrderCancelDialog } from './OrderCancelDialog';
import { OrderItemOptionInfoProps } from './OrderItemOptionInfo';

export function OrderItemActionButtons({
  option,
  orderItem,
  order,
}: OrderItemOptionInfoProps): JSX.Element {
  const router = useRouter();
  const { step } = option;
  const hasReview = !!orderItem.reviewId;
  const { orderId } = orderItem;

  // 해당 주문상품이 포함된 주문취소요청
  const cancelDataIncludingThisOrderItem = order.orderCancellations
    ?.flatMap((c) => {
      const { items, cancelCode } = c;
      return items.map((i) => ({ cancelCode, ...i }));
    })
    .find((oc) => oc.orderItemOptionId === option.id);

  // 해당 주문상품이 포함된 교환(재배송)요청
  const exchangeDataIncludingThisOrderItem = order.exchanges
    ?.flatMap((e) => {
      const { exchangeItems, exchangeCode } = e;
      return exchangeItems.map((i) => ({ exchangeCode, ...i }));
    })
    .find((oc) => oc.orderItemOptionId === option.id);

  // 해당 주문상품이 포함된 반품(환불)요청
  const returnDataIncludingThisOrderItem = order.returns
    ?.flatMap((r) => {
      const { items, returnCode } = r;
      return items.map((i) => ({ returnCode, ...i }));
    })
    .find((oc) => oc.orderItemOptionId === option.id);

  const purchaseConfirmDialog = useDisclosure();
  const orderCancelDialog = useDisclosure();
  const goodsInquireDialog = useDisclosure();
  const reviewDialog = useDisclosure();

  const buttonSet: {
    label: string;
    onClick: () => void;
    display: boolean;
    disabled: boolean;
  }[] = [
    {
      label: '배송조회',
      onClick: () => {
        alert('배송조회 페이지로 이동');
      },
      display: deliveryTrackingAbleSteps.includes(step), // 출고완료 이후 표시
      disabled: false,
    },
    {
      label: '주문 취소',
      onClick: () => {
        if (!cancelDataIncludingThisOrderItem) {
          orderCancelDialog.onOpen();
        } else {
          // 해당 주문상품이 포함된 주문취소요청이 있는경우 -> 그 주문요청 상세페이지로 이동
          router.push(
            `/mypage/exchange-return-cancel/cancel/${cancelDataIncludingThisOrderItem.cancelCode}`,
          );
        }
      },
      display: orderCancellationAbleSteps.includes(step), // 상품준비 이전에만 표시
      disabled: false,
    },
    {
      label: '재배송/환불 신청',
      onClick: () => {
        // 재배송/환불신청 없으면 재배송/환불 작성페이지로 이동
        if (!exchangeDataIncludingThisOrderItem && !returnDataIncludingThisOrderItem) {
          router.push(`/mypage/exchange-return-cancel/write?orderId=${orderId}`);
        }
        // 해당 주문상품이 포함된 재배송(교환)요청 있으면 재배송요청 상세페이지로 이동
        if (exchangeDataIncludingThisOrderItem) {
          router.push(
            `/mypage/exchange-return-cancel/exchange/${exchangeDataIncludingThisOrderItem.exchangeCode}`,
          );
        }
        // 해당 주문상품이 포함된 환불(반품)요청 있으면 환불 상세페이지로 이동
        if (returnDataIncludingThisOrderItem) {
          router.push(
            `/mypage/exchange-return-cancel/return/${returnDataIncludingThisOrderItem.returnCode}`,
          );
        }
      },
      display: exchangeReturnAbleSteps.includes(step), // 상품준비 이후 표시
      disabled: false,
    },
    {
      label: '구매확정',
      onClick: purchaseConfirmDialog.onOpen,
      display: purchaseConfirmAbleSteps.includes(step), // 배송완료 이후 표시
      disabled: step === 'purchaseConfirmed',
    },
    {
      label: !hasReview ? '후기 작성하기' : '작성한 후기 확인',
      onClick: !hasReview ? reviewDialog.onOpen : () => router.push('/mypage/review'),
      display: reviewAbleSteps.includes(step), // 배송완료 이후 표시 & 구매확정시 표시, 후기 작성하지 않았을때
      disabled: false,
    },
    {
      label: '문의하기',
      onClick: goodsInquireDialog.onOpen,
      display: !inquireDisableSteps.includes(step),
      disabled: false,
    },
  ];

  const toast = useToast();
  const orderPurchaseMutation = useOrderPurchaseConfirmMutation();
  // 구매확정 요청
  const purchaseConfirmRequest = async (): Promise<void> => {
    orderPurchaseMutation
      .mutateAsync({ orderItemOptionId: option.id })
      .then(() => {
        toast({ title: '구매 확정 완료', status: 'success' });
      })
      .catch((e) => {
        toast({
          title: '구매 확정 중 오류가 발생하였습니다.',
          status: 'error',
          description: e.code,
        });
      });
  };
  return (
    <SimpleGrid columns={{ base: 2, sm: 1 }} spacing={2}>
      {buttonSet.map(
        (button) =>
          button.display && (
            <Button
              minWidth={120}
              key={button.label}
              disabled={button.disabled}
              size="sm"
              onClick={() => button.onClick()}
            >
              {button.label}
            </Button>
          ),
      )}

      {/* 구매확정 다이얼로그 */}
      <ConfirmDialog
        title="구매확정하기"
        isOpen={purchaseConfirmDialog.isOpen}
        onClose={purchaseConfirmDialog.onClose}
        onConfirm={purchaseConfirmRequest}
      >
        <Text>
          구매확정시 후원방송인에게 후원금이 적립되며 <br />
          교환 및 환불이 어렵습니다.
        </Text>
      </ConfirmDialog>

      {/* 주문취소 다이얼로그 */}
      <OrderCancelDialog
        isOpen={orderCancelDialog.isOpen}
        onClose={orderCancelDialog.onClose}
        orderId={orderId}
      />

      {/* 후기 작성 다이얼로그 */}
      {orderItem.goodsId && (
        <ReviewCreateDialog
          isOpen={reviewDialog.isOpen}
          onClose={reviewDialog.onClose}
          goodsId={orderItem.goodsId}
          orderItemId={option.orderItemId}
        />
      )}
    </SimpleGrid>
  );
}
