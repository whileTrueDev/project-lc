import { Center, Spinner, Stack, Text, useToast } from '@chakra-ui/react';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { useCustomerOrderCancelMutation, useOrderDetail } from '@project-lc/hooks';
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
  const { data: orderDetailData } = useOrderDetail(orderId);

  const toast = useToast();
  const orderCancelMutation = useCustomerOrderCancelMutation();
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
      .then((res) => {
        // 주문접수 단계에서 취소 신청하여 바로 주문취소가 완료된 경우
        if (res.status === 'complete') {
          toast({ title: '주문 취소 완료', status: 'success' });
          return;
        }
        toast({ title: '주문 취소 신청 완료', status: 'success' });
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
      title="주문 취소 신청"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={purchaseConfirmRequest}
    >
      {orderDetailData ? (
        <Stack>
          <Text>이 주문을 취소하시겠습니까?</Text>
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
