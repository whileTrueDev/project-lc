import { SimpleGrid, Button } from '@chakra-ui/react';
import { OrderItemOption } from '@prisma/client';

export function OrderItemActionButtons({
  option,
  orderConfirmed,
}: {
  option: OrderItemOption;
  orderConfirmed?: boolean;
}): JSX.Element {
  const { step } = option;
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
      display: [
        'goodsReady',
        'exportReady',
        'exportDone',
        'shipping',
        'shippingDone',
      ].includes(step), // 상품준비 이후 표시
      disabled: !!orderConfirmed, // 구매확정 이후 disabled  -> orderConfirmed 값은 order.orderConfirmationDate 가 있는지 여부로 판단
    },
    {
      label: '구매확정',
      onClick: () => {
        // TODO : 모달 & 구매확정 요청 연결
        console.log('구매확정 모달 띄우기', option.id);
      },
      display: ['shippingDone'].includes(step), // 배송완료 이후 표시
      disabled: !!orderConfirmed, // TODO: orderItemOption 스키마 수정 후 orderItemOption.purchaseConfirmationDate로 판단
    },
    {
      label: '리뷰 작성하기',
      onClick: () => {
        console.log('리뷰작성 모달창 띄우기', option.id);
      },
      display: ['shippingDone'].includes(step), // 배송완료 이후 표시
      disabled: false, // TODO: orderItemOption 스키마 수정 후 orderItemOption.reivewId로 판단
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
    </SimpleGrid>
  );
}
