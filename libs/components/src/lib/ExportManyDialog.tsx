/* eslint-disable react/jsx-props-no-spreading */
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  Input,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Select,
  Stack,
  Text,
  UnorderedList,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import {
  useExportBundledOrdersMutation,
  useExportOrderMutation,
  useExportOrdersMutation,
  useFmOrders,
} from '@project-lc/hooks';
import {
  ExportBundledOrdersDto,
  ExportOrderDto,
  ExportOrdersDto,
  FindFmOrderRes,
  fmDeliveryCompanies,
} from '@project-lc/shared-types';
import { fmExportStore, useFmOrderStore } from '@project-lc/stores';
import { useCallback, useMemo, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
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
  const selectedOptions = fmExportStore((s) => s.selectedOptions);
  const resetSelectedOptions = fmExportStore((s) => s.resetSelectedOptions);

  // mutations
  const exportOrder = useExportOrderMutation();
  const exportOrders = useExportOrdersMutation();

  const onExportSuccess = useCallback(() => {
    toast({
      status: 'success',
      description: '출고 처리가 성공적으로 완료되었습니다.',
    });
    onClose();
    resetSelectedOptions();
  }, [onClose, toast, resetSelectedOptions]);

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
        // 출고 처리 API 요청
        exportOrder.mutateAsync(dto).then(onExportSuccess).catch(onExportFail);
      }
    },
    [exportOrder, formMethods, onExportFail, onExportSuccess],
  );

  /** 폼제출 핸들러 -> 일괄 출고 처리 API 요청 */
  async function onSubmit(formData: ExportOrderDto[]) {
    const selectedKeys = Object.keys(formData);
    const dto: ExportOrderDto[] = [];
    selectedKeys.forEach((k) => {
      const data = formData[Number(k)];
      if (selectedOptions.includes(data.orderId)) {
        dto.push(data);
      }
    });

    console.log(dto);
    // 일괄 출고처리 요청
    return exportAll({ exportOrders: dto });
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
            {selectedOrders.map((orderId, orderIndex) => (
              <Box key={orderId} mt={2}>
                <ExportOrderOptionList
                  onSubmitClick={onExportOneOrder}
                  orderId={orderId as string}
                  orderIndex={orderIndex}
                  selected={selectedOptions.includes(orderId as string)}
                />
              </Box>
            ))}
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
            <Button
              ml={2}
              colorScheme="pink"
              onClick={bundleDialog.onOpen}
              variant="outline"
              isDisabled={selectedOptions.length < 2}
            >
              합포장출고처리
            </Button>
            <Button
              ml={2}
              colorScheme="pink"
              type="submit"
              isDisabled={selectedOptions.length === 0}
            >
              일괄출고처리
            </Button>
          </ModalFooter>
        </ModalContent>

        <BundleExportDialog
          orders={orders}
          isOpen={bundleDialog.isOpen}
          onClose={bundleDialog.onClose}
          onSuccess={() => {
            bundleDialog.onClose();
          }}
        />
      </FormProvider>
    </Modal>
  );
}

export default ExportManyDialog;

export function BundleExportDialog({
  isOpen,
  onClose,
  onSuccess,
  orders,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => Promise<void> | void;
  orders: FindFmOrderRes[];
}) {
  const toast = useToast();
  const { getValues } = useFormContext<ExportOrderDto[]>();
  const selectedOptions = fmExportStore((s) => s.selectedOptions);
  const [deliveryCompany, setDeliveryCompany] = useState('');
  const [deliveryNumber, setDeliveryNumber] = useState('');

  const exportBundledOrders = useExportBundledOrdersMutation();

  /** 합포장 출고처리 가능한 지 체크 */
  const isAbleToBundle = useMemo(() => {
    const targetOrders = orders.filter((order) =>
      selectedOptions.includes(String(order.order_seq)),
    );

    return targetOrders.reduce((isOk, order, crrIndex) => {
      if (!isOk) return false;
      const prev = targetOrders[crrIndex - 1];
      if (!prev) return true;
      // * 선택한 주문의 주문자, 받는곳, 받는분, 받는분 연락처(휴대폰)의 정보가 동일해야 합니다.
      // 주문자
      if (order.order_user_name !== prev.order_user_name) return false;
      // 받는 곳
      if (order.recipient_address !== prev.recipient_address) return false;
      if (order.recipient_address_detail !== prev.recipient_address_detail) return false;
      // 받는 분
      if (order.recipient_user_name !== prev.recipient_user_name) return false;
      // 받는 분 연락처
      if (order.recipient_cellphone !== prev.recipient_cellphone) return false;

      // * 선택한 주문의 동일 판매자의 실물 배송상품을 합포장 할 수 있습니다.

      return true;
    }, true);
  }, [orders, selectedOptions]);

  /** 합포장 출고 처리 요청 */
  const exportBundle = useCallback(
    async (dto: ExportBundledOrdersDto) => {
      return exportBundledOrders
        .mutateAsync(dto)
        .then(() => {
          toast({
            status: 'success',
            description: '합포장 출고 처리가 성공적으로 완료되었습니다.',
          });
          onClose();
          if (onSuccess) onSuccess();
        })
        .catch(() =>
          toast({
            status: 'error',
            description:
              '합포장 출고 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          }),
        );
    },
    [exportBundledOrders, onClose, onSuccess, toast],
  );

  /** 합포장 출고처리 API 요청 */
  async function onBundledExportSubmit() {
    const formData = getValues();
    const selectedKeys = Object.keys(formData);
    const _orders: ExportOrderDto[] = [];
    selectedKeys.forEach((k) => {
      const data = formData[Number(k)];
      if (selectedOptions.includes(data.orderId)) {
        _orders.push({
          ...data,
          deliveryCompanyCode: deliveryCompany,
          deliveryNumber,
        });
      }
    });

    // 합포장 출고처리 요청
    return exportBundle({ exportOrders: _orders });
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>합포장 출고처리</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isAbleToBundle ? (
            <>
              <Text>선택된 주문 {selectedOptions.length} 개를 합포장 처리 합니다.</Text>
              <Stack mt={4} spacing={2}>
                <FormControl>
                  <Select
                    placeholder="택배사를 선택하세요."
                    value={deliveryCompany}
                    onChange={(e) => setDeliveryCompany(e.target.value)}
                  >
                    {Object.keys(fmDeliveryCompanies).map((company) => (
                      <option key={company} value={company}>
                        {fmDeliveryCompanies[company].name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <Input
                    placeholder="송장번호"
                    value={deliveryNumber}
                    onChange={(e) => {
                      setDeliveryNumber(e.target.value);
                    }}
                  />
                </FormControl>
              </Stack>
            </>
          ) : (
            <Stack spacing={4}>
              <Alert status="error">
                <AlertIcon />
                <Text>합포장 출고처리를 진행할 수 없습니다.</Text>
              </Alert>

              <UnorderedList>
                <ListItem>
                  선택한 모든 주문의 주문자, 받는곳, 받는분, 받는분 연락처(휴대폰)의
                  정보가 동일해야 합니다.
                </ListItem>
              </UnorderedList>
            </Stack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            isDisabled={!deliveryCompany || !deliveryNumber}
            colorScheme="pink"
            onClick={() => onBundledExportSubmit()}
          >
            출고처리
          </Button>
          <Button onClick={onClose} ml={2}>
            취소
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
