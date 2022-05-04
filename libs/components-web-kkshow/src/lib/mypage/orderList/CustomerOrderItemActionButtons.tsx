import {
  SimpleGrid,
  Button,
  useDisclosure,
  Text,
  useToast,
  Stack,
  Input,
  useBoolean,
  Collapse,
} from '@chakra-ui/react';
import { OrderItemOption } from '@prisma/client';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import {
  INFINITE_ORDER_LIST_QUERY_KEY,
  useOrderPurchaseConfirmMutation,
} from '@project-lc/hooks';
import { useQueryClient } from 'react-query';
import DaumPostcode, { AddressData } from 'react-daum-postcode';
import { useState } from 'react';
import { OrderItemOptionInfo, OrderItemOptionInfoProps } from './OrderItemOptionInfo';

export function OrderItemActionButtons({
  option,
  hasReview,
  goodsData,
}: {
  option: OrderItemOption;
  hasReview?: boolean;
} & OrderItemOptionInfoProps): JSX.Element {
  const { step, purchaseConfirmationDate } = option;
  const purchaseConfirmDialog = useDisclosure();
  const returnExchangeDialog = useDisclosure();
  const orderCancelDialog = useDisclosure();
  const reviewDialog = useDisclosure();
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
      display: ['exportDone', 'shipping', 'shippingDone'].includes(step), // 출고완료 이후 표시
      disabled: false,
    },
    {
      label: '주문 취소 신청',
      onClick: orderCancelDialog.onOpen,
      display: ['orderReceived', 'paymentConfirmed'].includes(step), // 상품준비 이전에만 표시
      disabled: false,
    },
    {
      label: '교환, 반품 신청',
      onClick: returnExchangeDialog.onOpen,
      display:
        [
          'goodsReady',
          'exportReady',
          'partialExportDone',
          'exportDone',
          'partialShipping',
          'shipping',
          'partialShippingDone',
          'shippingDone',
        ].includes(step) && !purchaseConfirmationDate, // 상품준비 이후 표시 && 구매확정 안했을 때
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
      onClick: reviewDialog.onOpen,
      display: ['shippingDone'].includes(step) && !!purchaseConfirmationDate, // 배송완료 이후 표시 & 리뷰 작성하지 않았을때
      disabled: !!hasReview || !purchaseConfirmationDate, // 이미 리뷰 작성했거나, 구매확정 안한경우 비활성
    },
    {
      label: '문의하기',
      onClick: goodsInquireDialog.onOpen,
      display: !['paymentCanceled', 'orderInvalidated', 'paymentFailed'].includes(step),
      disabled: false,
    },
  ];

  const toast = useToast();
  // 구매확정이후 orderlist invalidate 처리
  const queryClient = useQueryClient();
  const orderPurchaseMutation = useOrderPurchaseConfirmMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries(INFINITE_ORDER_LIST_QUERY_KEY);
    },
  });
  // 구매확정 요청
  const purchaseConfirmRequest = async (): Promise<void> => {
    orderPurchaseMutation
      .mutateAsync({ orderItemOptionId: option.id })
      .then((res) => {
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

      {/* 교환환불 다이얼로그 */}
      <ConfirmDialog
        title="교환, 반품 신청"
        isOpen={returnExchangeDialog.isOpen}
        onClose={returnExchangeDialog.onClose}
        onConfirm={async () => {
          console.log('교환반품 신청');
        }}
      >
        <RefundExchangeForm option={option} goodsData={goodsData} />
      </ConfirmDialog>

      {/* 주문취소 다이얼로그 */}
      <ConfirmDialog
        title="주문 취소 신청"
        isOpen={orderCancelDialog.isOpen}
        onClose={orderCancelDialog.onClose}
        onConfirm={async () => {
          console.log('주문 취소 신청');
        }}
      >
        <OrderCancelForm option={option} goodsData={goodsData} />
      </ConfirmDialog>
    </SimpleGrid>
  );
}

function RefundExchangeForm(props: OrderItemOptionInfoProps): JSX.Element {
  // useForm, handleSubmit 등은 api 작업 후 dto에 맞게 처리필요
  const [open, { off, toggle }] = useBoolean(false);

  const [addr, setAddr] = useState<string>('');
  const handleComplete = (data: AddressData): void => {
    const { zonecode, address, buildingName } = data;
    const fullAddress = buildingName
      ? `${address} (${buildingName}), ${zonecode}`
      : `${address}, ${zonecode}`; // 주소검색 결과 타입 참고 https://postcode.map.daum.net/guide
    setAddr(fullAddress);
    off();
  };
  return (
    <Stack as="form">
      <Stack>
        <Text>교환/반품 요청 주문상품 정보</Text>
        <OrderItemOptionInfo {...props} displayStatus={false} />
      </Stack>
      <Stack>
        <Text>교환 / 반품 사유</Text>
        <Input />
      </Stack>
      <Stack>
        <Text>
          회수지 주소
          <Button size="sm" onClick={toggle}>
            {open ? '닫기' : '찾기'}
          </Button>
          <Input value={addr} readOnly />
        </Text>
        <Collapse in={open} animateOpacity>
          <DaumPostcode onComplete={handleComplete} />
        </Collapse>
      </Stack>
    </Stack>
  );
}

function OrderCancelForm(props: OrderItemOptionInfoProps): JSX.Element {
  // useForm, handleSubmit 등은 api 작업 후 dto에 맞게 처리필요
  return (
    <Stack as="form">
      <Stack>
        <Text>주문 취소 요청 주문상품 정보</Text>
        <OrderItemOptionInfo {...props} displayStatus={false} />
      </Stack>
      <Stack>
        <Text>주문 취소 사유</Text>
        <Input />
      </Stack>
    </Stack>
  );
}
