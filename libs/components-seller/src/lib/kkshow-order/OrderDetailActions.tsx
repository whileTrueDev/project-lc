import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
  Alert,
  Button,
  Center,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { OrderStatusBadge } from '@project-lc/components-shared/order/OrderStatusBadge';
import { useOrderUpdateMutation } from '@project-lc/hooks';
import { exportableSteps, OrderDetailRes } from '@project-lc/shared-types';
import { useCallback } from 'react';
import { FaTruck } from 'react-icons/fa';
import ExportDialog from '../ExportDialog';

export interface OrderDetailActionsProps {
  order: OrderDetailRes;
}
export function OrderDetailActions({ order }: OrderDetailActionsProps): JSX.Element {
  const { mutateAsync: changeStatus, isLoading } = useOrderUpdateMutation();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const exportModal = useDisclosure();
  // const cancelOrderRequestModal = useDisclosure();
  const toast = useToast();

  const handleStatusChange = useCallback(
    () =>
      changeStatus({ orderId: order.id, dto: { step: 'goodsReady' } }).then(() =>
        toast({ description: '주문 상태가 올바르게 변경되었습니다.', status: 'success' }),
      ),
    [changeStatus, order.id, toast],
  );

  return (
    <>
      <Stack direction="row" alignItems="center">
        {['orderReceived'].includes(order.step) && (
          <Alert status="info">
            아직 결제확인이 되지 않은 주문입니다. 결제확인은 자동으로 처리됩니다.
          </Alert>
        )}

        {['paymentConfirmed'].includes(order.step) && (
          <Button colorScheme="green" size="sm" onClick={onOpen}>
            상품준비로 변경
          </Button>
        )}

        {exportableSteps.includes(order.step) && (
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
        <Text>{order.id} 주문의 상태를 변경하시겠습니까?</Text>
        <Center mt={6} mb={2}>
          <OrderStatusBadge step={order.step} />
          <ArrowForwardIcon mx={3} />
          <OrderStatusBadge step="goodsReady" />
        </Center>
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
