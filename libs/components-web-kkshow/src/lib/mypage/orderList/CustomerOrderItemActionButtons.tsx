import { SimpleGrid, Button, useDisclosure, Text } from '@chakra-ui/react';
import { OrderItemOption } from '@prisma/client';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { useOrderPurchaseConfirmMutation } from '@project-lc/hooks';

export function OrderItemActionButtons({
  option,
  hasReview,
}: {
  option: OrderItemOption;
  hasReview?: boolean;
}): JSX.Element {
  const { step, purchaseConfirmationDate } = option;
  const purchaseConfirmDialog = useDisclosure();
  const buttonSet: {
    label: string;
    onClick: () => void;
    display: boolean;
    disabled: boolean;
  }[] = [
    {
      label: '배송조회',
      onClick: () => {
        console.log('배송조회 페이지로 이동', option.id);
      },
      display: ['exportDone', 'shipping', 'shippingDone'].includes(step), // 출고완료 이후 표시
      disabled: false,
    },
    {
      label: '결제 취소 신청',
      onClick: () => {
        // TODO : 모달창 연결
        console.log('결제취소 모달 띄우기', option.id);
      },
      display: ['orderReceived', 'paymentConfirmed'].includes(step), // 상품준비 이전에만 표시
      disabled: false,
    },
    {
      label: '교환, 반품 신청',
      onClick: () => {
        // TODO : 모달창 연결
        console.log('교환,반품신청 모달 띄우기', option.id);
      },
      display:
        ['goodsReady', 'exportReady', 'exportDone', 'shipping', 'shippingDone'].includes(
          step,
        ) && !purchaseConfirmationDate, // 상품준비 이후 표시 && 구매확정 안했을 때
      disabled: !!purchaseConfirmationDate, // 구매확정 이후 disabled
    },
    {
      label: '구매확정',
      onClick: purchaseConfirmDialog.onOpen,
      display: ['shippingDone'].includes(step) && !purchaseConfirmationDate, // 배송완료 이후 표시 & 구매확정 하지 않았을때
      disabled: !!purchaseConfirmationDate,
    },
    {
      label: '리뷰 작성하기',
      onClick: () => {
        console.log('리뷰작성 모달창 띄우기', option.id);
      },
      display: ['shippingDone'].includes(step) && !!purchaseConfirmationDate, // 배송완료 이후 표시 & 리뷰 작성하지 않았을때
      disabled: !!hasReview || !purchaseConfirmationDate, // 이미 리뷰 작성했거나, 구매확정 안한경우 비활성
    },
    {
      label: '문의하기',
      onClick: () => {
        console.log('상품문의 모달창 띄우기', option.id);
      },
      display: !['paymentCanceled', 'orderInvalidated', 'paymentFailed'].includes(step),
      disabled: false,
    },
  ];

  const orderPurchaseMutation = useOrderPurchaseConfirmMutation();
  const purchaseConfirmRequest = async (): Promise<void> => {
    orderPurchaseMutation
      .mutateAsync({ orderItemOptionId: option.id })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.error(e);
      });
  };
  return (
    <SimpleGrid columns={{ base: 2, sm: 1 }} spacing={2}>
      {buttonSet.map(
        (button) =>
          button.display && (
            <Button
              key={button.label}
              disabled={button.disabled}
              size="sm"
              onClick={() => button.onClick()}
            >
              {button.label}
            </Button>
          ),
      )}
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
    </SimpleGrid>
  );
}
