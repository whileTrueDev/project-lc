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
import { useChangeFmOrderStatusMutation } from '@project-lc/hooks';
import {
  FindFmOrderDetailRes,
  getFmOrderStatusByNames,
  isOrderExportable,
} from '@project-lc/shared-types';
import { useCallback } from 'react';
import { FaTruck } from 'react-icons/fa';
import { ConfirmDialog } from './ConfirmDialog';
import ExportDialog from './ExportDialog';
import FmOrderStatusBadge from './FmOrderStatusBadge';
import OrderCancelRequestDialog from './OrderCancelRequestDialog';

export interface OrderDetailActionsProps {
  order: FindFmOrderDetailRes;
}
export function OrderDetailActions({ order }: OrderDetailActionsProps): JSX.Element {
  const { mutateAsync: changeStatus, isLoading } = useChangeFmOrderStatusMutation();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const exportModal = useDisclosure();
  const cancelOrderRequestModal = useDisclosure();
  const toast = useToast();

  const handleStatusChange = useCallback(
    () =>
      changeStatus({ orderId: order.id, targetStatus: '상품준비' }).then(() =>
        toast({
          description: '주문 상태가 올바르게 변경되었습니다.',
          status: 'success',
        }),
      ),
    [changeStatus, order.id, toast],
  );

  return (
    <>
      <Stack direction="row" alignItems="center">
        {getFmOrderStatusByNames(['주문접수']).includes(order.step) && (
          <Alert status="info">
            아직 결제확인이 되지 않은 주문입니다. 결제확인은 자동으로 처리됩니다.
          </Alert>
        )}

        {getFmOrderStatusByNames(['결제확인']).includes(order.step) && (
          <Button colorScheme="green" size="sm" onClick={onOpen}>
            상품준비로 변경
          </Button>
        )}

        {/* 판매자 결제취소 요청 버튼 */}
        {getFmOrderStatusByNames(['결제확인']).includes(order.step) && (
          <Button colorScheme="orange" size="sm" onClick={cancelOrderRequestModal.onOpen}>
            결제취소 요청
          </Button>
        )}

        {isOrderExportable(order.step) && (
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
          <FmOrderStatusBadge orderStatus={order.step} />
          <ArrowForwardIcon mx={3} />
          <FmOrderStatusBadge orderStatus="35" />
        </Center>
      </ConfirmDialog>

      <ExportDialog
        order={order}
        isOpen={exportModal.isOpen}
        onClose={exportModal.onClose}
      />

      {/* 결제취소 요청 다이얼로그 */}
      <OrderCancelRequestDialog
        order={order}
        isOpen={cancelOrderRequestModal.isOpen}
        onClose={cancelOrderRequestModal.onClose}
      />
    </>
  );
}
