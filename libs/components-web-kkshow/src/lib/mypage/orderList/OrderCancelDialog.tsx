import { Box, Center, Flex, Spinner, Stack, Text, useToast } from '@chakra-ui/react';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { OrderStatusBadge } from '@project-lc/components-shared/order/OrderStatusBadge';
import { RefundAccountForm } from '@project-lc/components-shared/payment/RefundAccountForm';
import {
  useCreateRefundMutation,
  useCustomerOrderCancelMutation,
  useOrderDetail,
} from '@project-lc/hooks';
import {
  convertPaymentMethodToKrString,
  CreateOrderCancellationDto,
  CreateRefundDto,
  RefundAccountDto,
} from '@project-lc/shared-types';
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
  // 주문취소 요청
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
      items: orderDetailData.orderItems.flatMap((item) =>
        item.options.map((opt) => ({
          orderItemId: item.id,
          orderItemOptionId: opt.id,
          amount: opt.quantity,
        })),
      ),
    };

    try {
      /** 생성하거나 완료되지 않은 주문취소요청 가져오는 이유?
       * 원래 주문취소요청 생성 시 '완료됨' 상태로 생성했음
       * 이 경우 환불데이터 생성 이후 주문 자체가 '주문무효 | 결제취소' 상태로 변경됨
       * 그러나 환불데이터 생성과정에 포함된 토스페이먼츠 결제취소 요청에서 오류가 발생하는 경우 (환불계좌 잘못 입력 등) 
       * 실제 소비자에게 환불이 이뤄지지 않았음에도 주문취소요청은 '완료됨', 주문은 '주문무효 | 결제취소' 상태로 존재하여 
       * 환불처리가 된 것처럼 보이고 다시 주문취소 요청을 생성할 수도 없음
       * 
       * 다시 주문취소 요청을 할 수 있도록 
       * 주문취소 생성시 '요청됨'으로 생성하고, 주문에 대한 완료되지 않은 주문취소가 있는 경우 해당 주문취소를 가지고 오도록 수정함
       //TODO : 환불데이터 생성과정에서 토스페이먼츠 결제취소 요청을 분리한다
       // TODO : 주문취소 생성 이후, 토스페이먼츠 결제취소 요청 먼저 => 이후 환불데이터 생성요청 => 주문취소 상태 업데이트& 주문상태 업데이트 요청
       */

      // 먼저 주문취소요청을 생성함(혹은 완료되지 않은 주문취소요청 가져옴)
      const res = await orderCancelMutation.mutateAsync(dto);

      // 이후 결제완료 주문인 경우에만 환불처리 진행
      if (orderDetailData.step === 'paymentConfirmed') {
        const refundAccountInfo = formMethods.getValues();
        const refundDto: CreateRefundDto = {
          orderId: orderDetailData.id,
          reason: '소비자의 주문취소신청',
          items: dto.items,
          orderCancellationId: res.id,
          refundAmount: orderDetailData.paymentPrice,
          paymentKey: orderDetailData.payment?.paymentKey,
          ...refundAccountInfo, // 가상계좌결제의 경우 환불 계좌 정보 추가
          refundBank: refundAccountInfo.refundBank,
        };
        await createRefundMutation.mutateAsync(refundDto);
      }
      toast({ title: '주문 취소 완료', status: 'success' });
    } catch (e: any) {
      toast({
        title: '주문 취소 중 오류가 발생하였습니다.',
        status: 'error',
        description: e?.response?.data?.message || e?.message,
      });
    }
  };

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
          <Text>이 주문을 취소하시겠습니까?</Text>
          <Box p={2} borderWidth="thin" rounded="md">
            <Flex gap={2}>
              <Text fontWeight="bold">주문번호:</Text>
              <Text>{orderDetailData.orderCode}</Text>
            </Flex>
            <Flex gap={2}>
              <Text fontWeight="bold">주문상태:</Text>
              <OrderStatusBadge step={orderDetailData.step} />
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
            <Box pl={4}>
              {orderDetailData.orderItems.flatMap((item) =>
                item.options.map((opt) => (
                  <OrderItemOptionInfo
                    key={opt.id}
                    order={orderDetailData}
                    option={opt}
                    orderItem={item}
                    displayStatus={false}
                  />
                )),
              )}
            </Box>
          </Box>

          {orderDetailData.payment?.method === 'virtualAccount' &&
            orderDetailData.step === 'paymentConfirmed' && (
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
