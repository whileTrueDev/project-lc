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
  CreateKkshowExportDto,
  exportableSteps,
  ExportManyDto,
  OrderDataWithRelations,
} from '@project-lc/shared-types';
import { sellerExportStore, useSellerOrderStore } from '@project-lc/stores';
import { getOrderItemOptionSteps } from '@project-lc/utils';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ExportBundleDialog } from './ExportBundleDialog';
import { ExportOrderOptionList } from './ExportOrderOptionList';

export type ExportManyDialogProps = Pick<ModalProps, 'isOpen' | 'onClose'> & {
  orders: OrderDataWithRelations[];
};

export function ExportManyDialog({
  orders,
  isOpen,
  onClose,
}: ExportManyDialogProps): JSX.Element {
  const bundleDialog = useDisclosure();
  const toast = useToast();
  const formMethods = useForm<CreateKkshowExportDto[]>();
  const selectedOrders = useSellerOrderStore((state) => state.selectedOrders);
  const selectedOrderShippings = sellerExportStore((s) => s.selectedOrderShippings);
  const resetSelectedOrderShippings = sellerExportStore(
    (s) => s.resetSelectedOrderShippings,
  );

  // 모달창 닫기 && orderShipping 배열 초기화
  const closeAndResetShippings = useCallback(() => {
    onClose();
    resetSelectedOrderShippings();
    formMethods.reset();
  }, [formMethods, onClose, resetSelectedOrderShippings]);

  // mutations
  const exportOrder = useExportOrderMutation();
  const exportOrders = useExportOrdersMutation();

  const onExportSuccess = useCallback(() => {
    toast({ status: 'success', description: '출고 처리가 성공적으로 완료되었습니다.' });
    closeAndResetShippings();
    formMethods.reset();
  }, [toast, closeAndResetShippings, formMethods]);

  const onExportFail = useCallback(() => {
    toast({
      status: 'error',
      description: '출고 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    });
  }, [toast]);

  /** 목록 일괄 출고 처리 */
  const exportAll = useCallback(
    async (dto: ExportManyDto) => {
      return exportOrders.mutateAsync(dto).then(onExportSuccess).catch(onExportFail);
    },
    [exportOrders, onExportFail, onExportSuccess],
  );

  /** 개별 출고 처리 */
  const onExportOneOrder = useCallback(
    async (orderId: number, orderIdx: number) => {
      const fieldID = `${orderIdx}` as const;
      const isValid = await formMethods.trigger(fieldID);
      if (isValid) {
        formMethods.setValue(`${orderIdx}.orderId`, orderId);
        const dto = formMethods.getValues(fieldID);
        // options배열, items의 빈 값 정리
        const realDto = {
          ...dto,
          items: dto.items.filter((v) => !!v),
          exportOptions: dto.items.filter((x) => !!x.quantity),
        };

        if (dto.items.every((o) => Number(o.quantity) === 0)) {
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
  async function onSubmit(formData: CreateKkshowExportDto[]): Promise<void> {
    const selectedKeys = Object.keys(formData);
    const dto: CreateKkshowExportDto[] = [];
    selectedKeys.forEach((k) => {
      const data = formData[Number(k)];
      const sellerId = orders.find((o) => o.id === data.orderId)?.orderItems[0]?.goods
        ?.sellerId;
      const realData = {
        ...data,
        items: data.items.filter((x) => !!x.quantity),
        sellerId,
      };
      dto.push(realData);
    });
    const realDto = dto.filter((d) =>
      selectedOrderShippings.find((x) => x.orderId === d.orderId),
    );
    if (realDto.length === 0) {
      toast({
        status: 'warning',
        description:
          '모든 주문상품의 보낼 수량이 0 입니다. 보낼 수량을 올바르게 입력해주세요.',
      });
      return;
    }
    // 일괄 출고처리 요청
    await exportAll({ exportOrders: realDto });
  }

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
        <ModalContent as="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
          <ModalHeader>출고처리</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedOrders.map((orderId, orderIndex) => {
              const _order = orders.find((_o) => _o.id === orderId);
              if (!_order) return null;
              const orderItemOptionSteps = getOrderItemOptionSteps(_order);
              const isExportable = orderItemOptionSteps.some((oios) =>
                exportableSteps.includes(oios),
              );
              if (!isExportable) return null;
              return (
                <Box key={orderId} mt={2}>
                  <ExportOrderOptionList
                    onSubmitClick={onExportOneOrder}
                    orderCode={_order.orderCode || undefined}
                    orderIndex={orderIndex}
                  />
                </Box>
              );
            })}
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button onClick={closeAndResetShippings}>취소</Button>
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
              isLoading={formMethods.formState.isSubmitting || exportOrders.isLoading}
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
            closeAndResetShippings();
          }}
        />
      </FormProvider>
    </Modal>
  );
}

export default ExportManyDialog;
