import { Box, Center, Flex, Spinner, Stack, Text, useToast } from '@chakra-ui/react';
import { OrderProcessStep } from '@prisma/client';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { RefundAccountForm } from '@project-lc/components-shared/payment/RefundAccountForm';
import {
  useCreateRefundMutation,
  useCustomerOrderCancelMutation,
  useOrderDetail,
  useUpdateOrderCancelMutation,
} from '@project-lc/hooks';
import {
  convertPaymentMethodToKrString,
  CreateOrderCancellationDto,
  CreateRefundDto,
  orderCancellationAbleSteps,
  OrderCancellationItemDto,
  RefundAccountDto,
} from '@project-lc/shared-types';
import { getOrderItemOptionSteps } from '@project-lc/utils';
import { pushDataLayer } from '@project-lc/utils-frontend';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { OrderItemOptionInfo } from './OrderItemOptionInfo';

export function OrderCancelDialog({
  isOpen,
  onClose,
  orderId,
}: {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
}): JSX.Element {
  const { data: orderDetailData } = useOrderDetail({ orderId });
  // 가상계좌 결제건으로, 환불계좌입력이 필요한 경우 사용하기 위한 form
  const formMethods = useForm<RefundAccountDto>({ mode: 'onChange' });

  const toast = useToast();
  const orderCancelMutation = useCustomerOrderCancelMutation();
  const createRefundMutation = useCreateRefundMutation();
  const orderCancelUpdateMutation = useUpdateOrderCancelMutation();

  // 주문취소 요청 가능한 상품옵션
  const targetItemOptions: (OrderCancellationItemDto & {
    discountPrice: number;
    step: OrderProcessStep;
    goodsId: number | null;
    goodsName: string | null;
    value: string | null;
  })[] = useMemo(() => {
    if (!orderDetailData) return [];
    return orderDetailData.orderItems.flatMap((item) =>
      item.options
        .filter((opt) => orderCancellationAbleSteps.includes(opt.step)) // 주문취소 가능한 상태의 주문상품옵션만 필터
        .map((opt) => ({
          orderItemId: item.id,
          orderItemOptionId: opt.id,
          quantity: opt.quantity,
          discountPrice: Number(opt.discountPrice), // CreateOrderCancellationDto와 무관. CreateRefundDto.refundAmount 계산용
          step: opt.step,
          goodsId: item.goodsId,
          goodsName: opt.goodsName,
          value: opt.value, // 옵션명
        })),
    );
  }, [orderDetailData]);

  const orderItemOptionsPrice = useMemo(() => {
    // 1. 취소할 상품들 옵션별 가격*개수 합
    return targetItemOptions
      .map((opt) => opt.quantity * opt.discountPrice)
      .reduce((sum, cur) => sum + cur, 0);
  }, [targetItemOptions]);

  const targetShippingCost = useMemo(() => {
    if (!orderDetailData) return 0;
    // 주문취소상품에 적용된 배송비 정보 찾기
    const targetOptionsId = targetItemOptions.map((o) => o.orderItemOptionId);
    const targetShippingData = orderDetailData.shippings?.filter((s) =>
      s.items.some((i) => i.options.some((op) => targetOptionsId.includes(op.id))),
    );
    return (
      targetShippingData
        ?.map((s) => Number(s.shippingCost))
        .reduce((sum, cur) => sum + cur, 0) || 0
    );
  }, [orderDetailData, targetItemOptions]);

  // 환불금액 = 결제금액 Order.paymentPrice (주문상품 개수*가격 + 배송비 - 마일리지 사용 등 할인)
  const refundAmount = useMemo(() => {
    return orderDetailData?.paymentPrice;
  }, [orderDetailData]);

  // * 주문취소 요청
  const purchaseConfirmRequest = async (): Promise<void> => {
    if (!orderDetailData) return;
    // 가상계좌 결제건인지
    const isVirtualAccount = orderDetailData.payment?.method === 'virtualAccount';
    if (isVirtualAccount) {
      const isValid = await formMethods.trigger();
      if (!isValid) throw new Error('Refund account form data is not valid');
    }

    const dto: CreateOrderCancellationDto = {
      orderId: orderDetailData.id,
      items: targetItemOptions.map((opt) => {
        const { orderItemId, orderItemOptionId, quantity } = opt;
        return {
          orderItemId,
          orderItemOptionId,
          quantity,
        };
      }),
    };

    //   /** 생성하거나 완료되지 않은 주문취소요청 가져오는 이유?
    //    * 원래 주문취소요청 생성 시 '완료됨' 상태로 생성했음
    //    * 이 경우 환불데이터 생성 이후 주문 자체가 '주문무효 | 결제취소' 상태로 변경됨
    //    * 그러나 환불데이터 생성과정에 포함된 토스페이먼츠 결제취소 요청에서 오류가 발생하는 경우 (환불계좌 잘못 입력 등)
    //    * 실제 소비자에게 환불이 이뤄지지 않았음에도 주문취소요청은 '완료됨', 주문은 '주문무효 | 결제취소' 상태로 존재하여
    //    * 환불처리가 된 것처럼 보이고 다시 주문취소 요청을 생성할 수도 없음
    //    *
    //    * 다시 주문취소 요청을 할 수 있도록
    //    * 주문취소 생성시 '요청됨'으로 생성하고, 주문에 대한 완료되지 않은 주문취소가 있는 경우 해당 주문취소를 가지고 오도록 수정함
    //    *
    //    */

    try {
      // 먼저 주문취소요청을 생성함(혹은 완료되지 않은 주문취소요청 가져옴)
      const orderCancellationRes = await orderCancelMutation.mutateAsync(dto);

      let refundId: number | undefined;
      // - 주문 금액 일부만 결제하는 기능은 없으므로 선택된(dto에 포함된) 주문상품옵션들은 모두 결제완료이거나 모두 입금대기 상태임
      // 선택된(dto에 포함된) 주문상품옵션들이 모두 "결제완료" 상태인 경우에만 결제취소 및 환불신청
      if (
        targetItemOptions.every((opt) => opt.step === 'paymentConfirmed') &&
        !!refundAmount
      ) {
        const refundAccountInfo = formMethods.getValues();
        const refundDto: CreateRefundDto = {
          orderId: orderDetailData.id,
          reason: '소비자의 주문취소신청',
          items: dto.items,
          orderCancellationId: orderCancellationRes.id,
          refundAmount, // 선택된(dto에 포함된) (주문상품옵션들 가격 * 개수) + 해당 주문상품옵션에 적용된 배송비
          paymentKey: orderDetailData.payment?.paymentKey,
          ...refundAccountInfo, // 가상계좌결제의 경우 환불 계좌 정보 추가
          refundBank: refundAccountInfo.refundBank,
        };
        const refundData = await createRefundMutation.mutateAsync(refundDto);
        refundId = refundData.id; // 환불데이터 생성 후 주문취소요청과 환불 연결하기 위해 refundId를 전달한다
      }

      // 주문취소요청 상태 업데이트
      await orderCancelUpdateMutation.mutateAsync({
        orderCancelId: orderCancellationRes.id,
        dto: { status: 'complete', refundId },
      });

      // 주문취소 이후
      // ga4 전자상거래 refund 이벤트 https://developers.google.com/analytics/devguides/collection/ga4/ecommerce?client_type=gtm#refund
      pushDataLayer({
        event: 'refund',
        ecommerce: {
          value: refundAmount, // 환불금액 = 주문상품옵션 가격*개수 + 배송비
          shipping: targetShippingCost,
          currency: 'KRW',
          transaction_id: orderDetailData.payment?.paymentKey,
          items: targetItemOptions.map((opt) => ({
            item_id: opt.goodsId,
            item_name: opt.goodsName,
            item_variant: opt.value,
            price: opt.discountPrice,
            quantity: opt.quantity,
          })),
        },
      });

      toast({ title: '주문 취소 요청이 처리되었습니다', status: 'success' });
    } catch (e: any) {
      toast({
        title: '주문 취소 중 오류가 발생하였습니다.',
        status: 'error',
        description: e?.response?.data?.message || e?.message,
      });
    }
  };

  const orderItemOptionSteps = getOrderItemOptionSteps(orderDetailData);

  return (
    <ConfirmDialog
      title="주문 취소"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={purchaseConfirmRequest}
      isLoading={createRefundMutation.isLoading || orderCancelMutation.isLoading}
      isDisabled={
        orderDetailData?.payment?.method === 'virtualAccount' &&
        !formMethods.formState.isValid
      }
    >
      {orderDetailData ? (
        <Stack>
          <Text>이 주문 상품을 취소하시겠습니까?</Text>
          <Box p={2} borderWidth="thin" rounded="md">
            <Flex gap={2}>
              <Text fontWeight="bold">주문번호:</Text>
              <Text>{orderDetailData.orderCode}</Text>
            </Flex>

            {orderDetailData.payment && (
              <Flex gap={2}>
                <Text fontWeight="bold">결제수단:</Text>
                <Text>
                  {convertPaymentMethodToKrString(orderDetailData.payment.method)}
                </Text>
              </Flex>
            )}
            <Text fontWeight="bold">주문상품</Text>
            <Stack pl={4} spacing={2}>
              {orderDetailData.orderItems.flatMap((item) =>
                item.options
                  .filter((opt) => orderCancellationAbleSteps.includes(opt.step)) // 주문취소 가능한 상태의 주문상품옵션만 필터
                  .map((opt) => (
                    <OrderItemOptionInfo
                      key={opt.id}
                      order={orderDetailData}
                      option={opt}
                      orderItem={item}
                      displayStatus={false}
                    />
                  )),
              )}
            </Stack>
          </Box>

          {orderDetailData.payment?.method === 'virtualAccount' &&
            orderItemOptionSteps.some((oios) => oios === 'paymentConfirmed') && (
              <FormProvider {...formMethods}>
                <RefundAccountForm />
              </FormProvider>
            )}
        </Stack>
      ) : (
        <Center>
          <Spinner />
        </Center>
      )}
    </ConfirmDialog>
  );
}
