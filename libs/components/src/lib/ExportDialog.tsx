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
  useExportOrderMutation,
  useOrderExportableCheck,
  checkShippingCanExport,
  checkShippingExportIsDone,
} from '@project-lc/hooks';
import { ExportOrderDto, FindFmOrderDetailRes } from '@project-lc/shared-types';
import { fmExportStore } from '@project-lc/stores';
import { useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ExportBundleDialog } from './ExportBundleDialog';
import { ExportOrderOptionList } from './ExportOrderOptionList';

export type OrderExportDialogProps = Pick<ModalProps, 'isOpen' | 'onClose'> & {
  order: FindFmOrderDetailRes;
};

/** 단일 주문 출고 처리 모달창 */
export function ExportDialog({
  order,
  isOpen,
  onClose,
}: OrderExportDialogProps): JSX.Element {
  const resetSelectedOrderShippings = fmExportStore((s) => s.resetSelectedOrderShippings);
  // 이미 출고가 끝난 주문인 지 체크
  const { isDone } = useOrderExportableCheck(order);

  const bundleDialog = useDisclosure();
  const toast = useToast();
  const formMethods = useForm<ExportOrderDto[]>();
  const exportOrder = useExportOrderMutation();

  const onExportSuccess = useCallback(() => {
    toast({
      status: 'success',
      description: '출고 처리가 성공적으로 완료되었습니다.',
    });
    onClose();
  }, [onClose, toast]);

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
    async (orderId: string, orderShippingIdx: number) => {
      const fieldID = `${orderShippingIdx}` as const;
      const isValid = await formMethods.trigger(fieldID);
      if (isValid) {
        formMethods.setValue(`${orderShippingIdx}.orderId`, orderId);
        const dto = formMethods.getValues(fieldID);
        const realDto = { ...dto, exportOptions: dto.exportOptions.filter((x) => !!x) };
        // 보낼 수량이 0개 인지 체크
        if (realDto.exportOptions.every((o) => Number(o.exportEa) === 0)) {
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
    [exportOrder, formMethods, onExportFail, onExportSuccess, toast],
  );

  /** 합포장 출고처리가 가능한지 여부 */
  const isBundleExportable = useMemo(() => {
    return order.shippings.every((shipping) => {
      const a = checkShippingCanExport(shipping);
      const isShippingDone = checkShippingExportIsDone(shipping);
      return a && !isShippingDone;
    });
  }, [order.shippings]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="6xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <FormProvider {...formMethods}>
        <ModalContent as="form">
          <ModalHeader>{order.order_seq} 출고처리</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isDone && (
              <Alert mb={6} mt={2} status="info">
                <AlertIcon />이 주문은 모두 출고 완료되었습니다.
              </Alert>
            )}
            <ExportOrderOptionList
              orderId={String(order.order_seq)}
              disableSelection
              onSubmitClick={onExportOneOrder}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                resetSelectedOrderShippings();
                onClose();
              }}
            >
              취소
            </Button>
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
            onClose();
          }}
        />
      </FormProvider>
    </Modal>
  );
}

export default ExportDialog;
