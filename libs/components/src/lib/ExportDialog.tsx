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
  useToast,
} from '@chakra-ui/react';
import { useOrderExportableCheck, useExportOrderMutation } from '@project-lc/hooks';
import { ExportOrderDto, FindFmOrderDetailRes } from '@project-lc/shared-types';
import { FormProvider, useForm } from 'react-hook-form';
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
  // 이미 출고가 끝난 주문인 지 체크
  const { isDone } = useOrderExportableCheck(order);

  const toast = useToast();
  const formMethods = useForm<ExportOrderDto[]>();
  const exportMutation = useExportOrderMutation();

  /** 폼제출 핸들러 -> 출고 처리 API 요청 */
  async function onSubmit(formData: ExportOrderDto[]) {
    if (formData[0].exportOptions.every((o) => Number(o.exportEa) === 0)) {
      return toast({
        status: 'warning',
        description:
          '모든 주문상품의 보낼 수량이 0 입니다. 보낼 수량을 올바르게 입력해주세요.',
      });
    }
    // react-query 요청
    return exportMutation
      .mutateAsync({
        ...formData[0],
        orderId: String(order.order_seq),
      })
      .then(() => {
        toast({
          status: 'success',
          description: '출고 처리가 성공적으로 완료되었습니다.',
        });
        onClose();
      })
      .catch(() => {
        toast({
          status: 'error',
          description: '출고 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        });
      });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="6xl">
      <ModalOverlay />
      <FormProvider {...formMethods}>
        <ModalContent as="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
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
              selected
              disableSelection
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </FormProvider>
    </Modal>
  );
}

export default ExportDialog;
