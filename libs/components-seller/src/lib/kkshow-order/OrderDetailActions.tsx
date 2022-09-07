import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
  Alert,
  Box,
  Button,
  Flex,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { OrderStatusBadge } from '@project-lc/components-shared/order/OrderStatusBadge';
import { useOrderUpdateMutation, useProfile } from '@project-lc/hooks';
import { exportableSteps, OrderDetailRes } from '@project-lc/shared-types';
import { getOrderItemOptionSteps } from '@project-lc/utils';
import { useCallback } from 'react';
import { FaTruck } from 'react-icons/fa';
import ExportDialog from '../ExportDialog';

export interface OrderDetailActionsProps {
  order: OrderDetailRes;
}
export function OrderDetailActions({ order }: OrderDetailActionsProps): JSX.Element {
  const { mutateAsync: changeStatus, isLoading } = useOrderUpdateMutation();
  const { data: profileData } = useProfile();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const exportModal = useDisclosure();
  const toast = useToast();

  const handleStatusChange = useCallback(() => {
    if (profileData) {
      return changeStatus({
        orderId: order.id,
        dto: { step: 'goodsReady', sellerId: profileData.id },
      })
        .then(() =>
          toast({
            description: '주문 상태가 올바르게 변경되었습니다.',
            status: 'success',
          }),
        )
        .catch((e) => {
          console.log(e);
          toast({
            title: '주문 상태 변경 중 오류가 발생했습니다.',
            status: 'error',
            description: e?.message || e?.response?.data?.message,
          });
        });
    }
    return Promise.resolve();
  }, [changeStatus, order.id, profileData, toast]);

  const orderItemOptionSteps = getOrderItemOptionSteps(order);
  return (
    <>
      <Stack direction="row" alignItems="center">
        {orderItemOptionSteps.includes('orderReceived') && (
          <Alert status="info">
            아직 결제확인이 되지 않은 주문입니다. 결제확인은 자동으로 처리됩니다.
          </Alert>
        )}

        {orderItemOptionSteps.includes('paymentConfirmed') && (
          <Button colorScheme="green" variant="outline" size="sm" onClick={onOpen}>
            일괄 상품준비 처리
          </Button>
        )}

        {orderItemOptionSteps.some((oios) => exportableSteps.includes(oios)) && (
          <Button
            variant={order.exports ? 'outline' : 'solid'}
            size="sm"
            colorScheme="pink"
            rightIcon={<FaTruck />}
            onClick={exportModal.onOpen}
          >
            출고처리 진행
          </Button>
        )}
      </Stack>

      <ConfirmDialog
        title="상품준비 처리"
        isOpen={isOpen}
        isLoading={isLoading}
        onClose={onClose}
        onConfirm={handleStatusChange}
      >
        <Text>{order.orderCode} 주문의 상태를 다음과 같이 변경하시겠습니까?</Text>
        <Flex align="center" justify="center" flexDir="column" mt={4}>
          {order.orderItems.map((oi) => (
            <Box key={oi.id}>
              {oi.options.map((oio) => (
                <Flex key={oio.id} align="center" gap={2}>
                  {oio.name && oio.value && (
                    <Text>
                      {oio.name}: {oio.value}
                    </Text>
                  )}
                  <OrderStatusBadge step={oio.step} />
                  <ArrowForwardIcon />
                  <OrderStatusBadge step="goodsReady" />
                </Flex>
              ))}
            </Box>
          ))}
        </Flex>
      </ConfirmDialog>

      <ExportDialog
        order={order}
        isOpen={exportModal.isOpen}
        onClose={exportModal.onClose}
      />
    </>
  );
}

export default OrderDetailActions;
