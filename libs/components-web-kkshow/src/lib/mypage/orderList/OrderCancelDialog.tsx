import { Center, Spinner, Stack, Text, useToast } from '@chakra-ui/react';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import {
  useCreateRefundMutation,
  useCustomerOrderCancelMutation,
  useOrderDetail,
} from '@project-lc/hooks';
import { CreateRefundDto } from '@project-lc/shared-types';
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

  const toast = useToast();
  const orderCancelMutation = useCustomerOrderCancelMutation();
  const createRefundMutation = useCreateRefundMutation();
  // 주문취소 요청
  const purchaseConfirmRequest = async (): Promise<void> => {
    if (!orderDetailData) return;

    const dto = {
      orderId: orderDetailData.id,
      items: orderDetailData.orderItems.flatMap((item) =>
        item.options.map((opt) => ({
          orderItemId: item.id,
          orderItemOptionId: opt.id,
          amount: opt.quantity,
        })),
      ),
    };

    orderCancelMutation
      .mutateAsync(dto)
      .then(async (res) => {
        // 결제완료 주문인 경우 환불처리 진행
        if (orderDetailData.step === 'paymentConfirmed') {
          const refundDto: CreateRefundDto = {
            orderId: orderDetailData.id,
            reason: '소비자의 주문취소신청',
            items: dto.items,
            orderCancellationId: res.id,
            refundAmount: orderDetailData.paymentPrice,
            paymentKey: orderDetailData.payment?.paymentKey,
          };
          await createRefundMutation.mutateAsync(refundDto);
        }

        toast({ title: '주문 취소 완료', status: 'success' });
      })
      .catch((e) => {
        toast({
          title: '주문 취소 중 오류가 발생하였습니다.',
          status: 'error',
          description: e.response?.data?.message || e.message,
        });
      });
  };

  return (
    <ConfirmDialog
      title="주문 취소"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={purchaseConfirmRequest}
      isLoading={createRefundMutation.isLoading || orderCancelMutation.isLoading}
    >
      {orderDetailData ? (
        <Stack>
          <Text>이 주문을 취소하시겠습니까? {orderDetailData.step}</Text>
          <Text>주문번호 : {orderDetailData.orderCode}</Text>
          <Text>주문상품</Text>
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
        </Stack>
      ) : (
        <Center>
          <Spinner />
        </Center>
      )}
    </ConfirmDialog>
  );
}
