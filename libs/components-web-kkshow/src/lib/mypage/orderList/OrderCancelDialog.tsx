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
      const res = await orderCancelMutation.mutateAsync(dto);
      // 결제완료 주문인 경우 환불처리 진행
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
