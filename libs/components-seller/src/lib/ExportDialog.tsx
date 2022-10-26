import {
  Alert,
  AlertIcon,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import {
  checkShippingCanExport,
  checkShippingExportIsDone,
  useExportOrderMutation,
  useOrderExportableCheck,
} from '@project-lc/hooks';
import { CreateKkshowExportDto, OrderDetailRes } from '@project-lc/shared-types';
import { sellerExportStore } from '@project-lc/stores';
import { useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ExportBundleDialog } from './ExportBundleDialog';
import { ExportOrderOptionList } from './ExportOrderOptionList';

export type OrderExportDialogProps = Pick<ModalProps, 'isOpen' | 'onClose'> & {
  order: OrderDetailRes;
};

/** 단일 주문 출고 처리 모달창 */
export function ExportDialog({
  order,
  isOpen,
  onClose,
}: OrderExportDialogProps): JSX.Element {
  const resetSelectedOrderShippings = sellerExportStore(
    (s) => s.resetSelectedOrderShippings,
  );
  // 이미 출고가 끝난 주문인 지 체크
  const { isDone } = useOrderExportableCheck(order);

  const bundleDialog = useDisclosure();
  const toast = useToast();
  const formMethods = useForm<CreateKkshowExportDto[]>();
  const exportOrder = useExportOrderMutation();

  // 모달창 닫기 && orderShipping 배열 초기화
  const closeAndResetShippings = useCallback(() => {
    onClose();
    resetSelectedOrderShippings();
  }, [onClose, resetSelectedOrderShippings]);

  const onExportSuccess = useCallback(() => {
    toast({ status: 'success', description: '출고 처리가 성공적으로 완료되었습니다.' });
    closeAndResetShippings();
    formMethods.reset();
  }, [closeAndResetShippings, formMethods, toast]);

  const onExportFail = useCallback(
    (err: any) => {
      toast({
        status: 'error',
        description: '출고 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
      throw err;
    },
    [toast],
  );

  /** 개별 출고 처리 */
  const onExportOneOrder = useCallback(
    async (orderId: number, orderShippingIdx: number) => {
      const fieldID = `${orderShippingIdx}` as const;
      const isValid = await formMethods.trigger(fieldID);
      if (isValid) {
        formMethods.setValue(`${orderShippingIdx}.orderId`, orderId);
        const dto = formMethods.getValues(fieldID);

        // 출고처리할 상품의 판매자id 조회 => export.sellerId로 저장
        const itemIds = dto.items.map((i) => i.orderItemId);
        const sellerId = order.orderItems.find((oi) => itemIds.includes(oi.id))?.goods
          ?.sellerId;

        const realDto = {
          ...dto,
          sellerId,
          items: dto.items.filter((x) => !!x.quantity),
        };
        // 보낼 수량이 0개 인지 체크
        if (realDto.items.every((o) => Number(o.quantity) === 0)) {
          toast({
            status: 'warning',
            description:
              '모든 주문상품의 보낼 수량이 0 입니다. 보낼 수량을 올바르게 입력해주세요.',
          });
        } else {
          // 출고 처리 API 요청
          exportOrder.mutateAsync(realDto).then(onExportSuccess).catch(onExportFail);
        }
      }
    },
    [exportOrder, formMethods, onExportFail, onExportSuccess, order, toast],
  );

  /** 합포장 출고처리가 가능한지 여부 */
  const isBundleExportable = useMemo(() => {
    const exportable = order.shippings?.every((shipping) => {
      const a = checkShippingCanExport(shipping);
      const isShippingDone = checkShippingExportIsDone(shipping);
      return a && !isShippingDone;
    });
    // shipping 목록이 2개 이상이어야 합포장 출고처리 버튼 활성화
    const shippingMoreThanTwo = order.shippings && order.shippings.length >= 2;
    return exportable && shippingMoreThanTwo;
  }, [order.shippings]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeAndResetShippings}
      isCentered
      size="6xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <FormProvider {...formMethods}>
        <ModalContent as="form">
          <ModalHeader>{order.orderCode} 출고처리</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isDone && (
              <Alert mb={6} mt={2} status="info">
                <AlertIcon />이 주문은 모두 출고 완료되었습니다.
              </Alert>
            )}
            <ExportOrderOptionList
              orderCode={order.orderCode || undefined}
              disableSelection
              onSubmitClick={onExportOneOrder}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={closeAndResetShippings}>취소</Button>
            <Button
              ml={2}
              colorScheme="pink"
              onClick={bundleDialog.onOpen}
              variant="outline"
              isDisabled={!isBundleExportable}
            >
              합포장출고처리
            </Button>
          </ModalFooter>
        </ModalContent>

        <ExportBundleDialog
          orders={[order]}
          isOpen={bundleDialog.isOpen}
          onClose={bundleDialog.onClose}
          onSuccess={() => {
            bundleDialog.onClose();
            closeAndResetShippings();
          }}
        />
      </FormProvider>
    </Modal>
  );
}

export default ExportDialog;
