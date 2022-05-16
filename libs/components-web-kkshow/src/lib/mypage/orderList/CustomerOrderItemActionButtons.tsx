import { Button, SimpleGrid, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
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
}: OrderItemOptionInfoProps): JSX.Element {
  const router = useRouter();
  const { step, purchaseConfirmationDate } = option;
  const hasReview = !!orderItem.reviewId;
  const { orderId } = orderItem;
  const orderCancellation = orderItem.orderCancellationItems?.find(
    (item) => item.orderItemOptionId === option.id,
  );

  const purchaseConfirmDialog = useDisclosure();
  const orderCancelDialog = useDisclosure();
  const goodsInquireDialog = useDisclosure();

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
      label: '주문 취소 신청',
      onClick: orderCancelDialog.onOpen,
      display: orderCancellationAbleSteps.includes(step), // 상품준비 이전에만 표시
      disabled: !!orderCancellation,
    },
    {
      label: '재배송/환불 신청',
      onClick: () => router.push(`/mypage/exchange-return-cancel/write?orderId=${orderId}`),
      display: exchangeReturnAbleSteps.includes(step) && !purchaseConfirmationDate, // 상품준비 이후 표시 && 구매확정 안했을 때
      disabled: !!purchaseConfirmationDate, // 구매확정 이후 disabled
    },
    {
      label: '구매확정',
      onClick: purchaseConfirmDialog.onOpen,
      display: purchaseConfirmAbleSteps.includes(step) && !purchaseConfirmationDate, // 배송완료 이후 표시 & 구매확정 하지 않았을때
      disabled: !!purchaseConfirmationDate,
    },
    {
      label: '리뷰 작성하기',
      onClick: () => {
        alert('리뷰작성페이지로 이동');
      }, // TODO: 리뷰작성 페이지로 이동
      display: reviewAbleSteps.includes(step), // 배송완료 이후 표시 & 구매확정시 표시, 리뷰 작성하지 않았을때
      disabled: !!hasReview || !purchaseConfirmationDate, // 이미 리뷰 작성했거나, 구매확정 안한경우 비활성
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
    </SimpleGrid>
  );
}
