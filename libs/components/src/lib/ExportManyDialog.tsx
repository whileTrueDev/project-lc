import {
  Box,
  Button,
  Divider,
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
import { useExportOrderMutation, useExportOrdersMutation } from '@project-lc/hooks';
import {
  ExportOrderDto,
  ExportOrdersDto,
  FindFmOrderRes,
  isOrderExportable,
} from '@project-lc/shared-types';
import { fmExportStore, useFmOrderStore } from '@project-lc/stores';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ExportBundleDialog } from './ExportBundleDialog';
import { ExportOrderOptionList } from './ExportOrderOptionList';

export type ExportManyDialogProps = Pick<ModalProps, 'isOpen' | 'onClose'> & {
  orders: FindFmOrderRes[];
};

export function ExportManyDialog({
  orders,
  isOpen,
  onClose,
}: ExportManyDialogProps): JSX.Element {
  const bundleDialog = useDisclosure();
  const toast = useToast();
  const formMethods = useForm<ExportOrderDto[]>();

  const selectedOrders = useFmOrderStore((state) => state.selectedOrders);
  const selectedOrderShippings = fmExportStore((s) => s.selectedOrderShippings);
  const resetSelectedOrderShippings = fmExportStore((s) => s.resetSelectedOrderShippings);

  // mutations
  const exportOrder = useExportOrderMutation();
  const exportOrders = useExportOrdersMutation();

  const onExportSuccess = useCallback(() => {
    toast({
      status: 'success',
      description: '출고 처리가 성공적으로 완료되었습니다.',
    });
    onClose();
    resetSelectedOrderShippings();
  }, [onClose, toast, resetSelectedOrderShippings]);

  const onExportFail = useCallback(() => {
    toast({
      status: 'error',
      description: '출고 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    });
  }, [toast]);

  /** 목록 일괄 출고 처리 */
  const exportAll = useCallback(
    async (dto: ExportOrdersDto) => {
      return exportOrders.mutateAsync(dto).then(onExportSuccess).catch(onExportFail);
    },
    [exportOrders, onExportFail, onExportSuccess],
  );

  /** 개별 출고 처리 */
  const onExportOneOrder = useCallback(
    async (orderId: string, orderIdx: number) => {
      const fieldID = `${orderIdx}` as const;
      const isValid = await formMethods.trigger(fieldID);
      if (isValid) {
        formMethods.setValue(`${orderIdx}.orderId`, orderId);
        const dto = formMethods.getValues(fieldID);
        // options배열의 빈 값 정리
        const realDto = {
          ...dto,
          exportOptions: dto.exportOptions.filter((x) => !!x.exportEa),
        };
        if (dto.exportOptions.every((o) => Number(o.exportEa) === 0)) {
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

  /** 폼제출 핸들러 -> 일괄 출고 처리 API 요청 */
  async function onSubmit(formData: ExportOrderDto[]): Promise<void> {
    const selectedKeys = Object.keys(formData);
    const dto: ExportOrderDto[] = [];
    selectedKeys.forEach((k) => {
      const data = formData[Number(k)];
      // options배열의 빈 값 정리
      const realData = {
        ...data,
        exportOptions: data.exportOptions.filter((x) => !!x.exportEa),
      };
      if (selectedOrderShippings.includes(realData.shippingSeq)) {
        if (!realData.exportOptions.every((o) => Number(o.exportEa) === 0)) {
          dto.push(realData);
        }
      }
    });

    if (dto.length === 0) {
      toast({
        status: 'warning',
        description:
          '모든 주문상품의 보낼 수량이 0 입니다. 보낼 수량을 올바르게 입력해주세요.',
      });
      return;
    }

    // 일괄 출고처리 요청
    await exportAll({ exportOrders: dto });
  }

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
        <ModalContent as="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
          <ModalHeader>출고처리</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedOrders.map((orderId, orderIndex) => {
              const _order = orders.find((_o) => _o.id === orderId);
              if (!_order) return null;
              const isExportable = isOrderExportable(_order.step);
              if (!isExportable) return null;

              return (
                <Box key={orderId} mt={2}>
                  <ExportOrderOptionList
                    onSubmitClick={onExportOneOrder}
                    orderId={orderId as string}
                    orderIndex={orderIndex}
                  />
                </Box>
              );
            })}
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
            <Button
              ml={2}
              colorScheme="pink"
              onClick={bundleDialog.onOpen}
              variant="outline"
              isDisabled={selectedOrderShippings.length < 2}
            >
              합포장출고처리
            </Button>
            <Button
              ml={2}
              colorScheme="pink"
              type="submit"
              isDisabled={selectedOrderShippings.length === 0}
            >
              일괄출고처리
            </Button>
          </ModalFooter>
        </ModalContent>

        <ExportBundleDialog
          orders={orders}
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

export default ExportManyDialog;
