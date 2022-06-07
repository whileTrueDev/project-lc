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
import FmOrderStatusBadge from '@project-lc/components-shared/FmOrderStatusBadge';
import {
  useChangeFmOrderStatusMutation,
  useOrderUpdateMutation,
} from '@project-lc/hooks';
import {
  exportableSteps,
  FindFmOrderDetailRes,
  getFmOrderStatusByNames,
  isOrderExportable,
  OrderDetailRes,
  orderProcessStepDict,
} from '@project-lc/shared-types';
import { useCallback } from 'react';
import { FaTruck } from 'react-icons/fa';
import ExportDialog from '../ExportDialog';

export interface OrderDetailActionsProps {
  order: OrderDetailRes;
}
export function OrderDetailActions({ order }: OrderDetailActionsProps): JSX.Element {
  // const { mutateAsync: changeStatus, isLoading } = useChangeFmOrderStatusMutation();
  const { mutateAsync: changeStatus, isLoading } = useOrderUpdateMutation();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const exportModal = useDisclosure();
  // const cancelOrderRequestModal = useDisclosure();
  const toast = useToast();

  const handleStatusChange = useCallback(
    () =>
      changeStatus({
        orderId: order.id,
        dto: {
          step: 'goodsReady',
        },
      }).then(() =>
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

        {/* 판매자 결제취소 요청 버튼 => 판매자가 관리자에게 요청하는 기능임 
        크크쇼에서는 판매자가 소비자 연락처 조회가능하므로 필요없는 기능이라 생각하여 주석처리함
        // TODO: 필요없다면 삭제하기
        */}
        {/* {getFmOrderStatusByNames(['결제확인']).includes(order.step) && (
          <Button colorScheme="orange" size="sm" onClick={cancelOrderRequestModal.onOpen}>
            결제취소 요청
          </Button>
        )} */}

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
          <FmOrderStatusBadge orderStatus={orderProcessStepDict[order.step]} />
          <ArrowForwardIcon mx={3} />
          <FmOrderStatusBadge orderStatus="35" />
        </Center>
      </ConfirmDialog>

      {/* // TODO: exportDialog 연결 */}
      {/* <ExportDialog
        order={order}
        isOpen={exportModal.isOpen}
        onClose={exportModal.onClose}
      /> */}

      {/* // TODO: 필요없다면 삭제하기 */}
      {/* 결제취소 요청 다이얼로그 -> 판매자가 크크쇼 관리자에게 결제취소 요청하는 다이얼로그. 판매자가 주문자 연락처 알 수 있는 크크쇼에서는 필요없는 기능임 */}
      {/* <OrderCancelRequestDialog
        order={order}
        isOpen={cancelOrderRequestModal.isOpen}
        onClose={cancelOrderRequestModal.onClose}
      /> */}
    </>
  );
}

export default OrderDetailActions;