import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { GridTableItem } from '@project-lc/components-layout/GridTableItem';
import { useAdminBroadcasterSettlementInfoConfirmMutation } from '@project-lc/hooks';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { AdminBroadcasterSettlementInfoConfirmationDialogProps } from './AdminBroadcasterSettlementInfoConfirmationDialog';
import { rejectionFormData } from './AdminBusinessRegistrationRejectionDialog';

export function AdminBroadcasterSettlementInfoRejectionDialog({
  isOpen,
  onClose,
  row,
}: AdminBroadcasterSettlementInfoConfirmationDialogProps): JSX.Element {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<rejectionFormData>();

  const initialRef = useRef(null);

  // 다른 상품의 검수 반려 눌렀을때만 반려사유 textarea 초기화
  useEffect(() => {
    reset();
  }, [reset, row]);

  const rejectMutation = useAdminBroadcasterSettlementInfoConfirmMutation();

  async function handleRejectionGood({
    id,
    rejectionReason,
  }: {
    id: number;
    rejectionReason: string;
  }): Promise<void> {
    try {
      await rejectMutation.mutateAsync({
        id,
        status: 'rejected',
        rejectionReason,
      });
      toast({
        title: '방송인의 정산정보가 반려되었습니다.',
        status: 'success',
      });
      onClose();
    } catch (error) {
      toast({
        title: '방송인의 정산정보 반려가 실패하였습니다.',
        status: 'error',
      });
    }
  }

  const useSubmit = (data: rejectionFormData): void => {
    const { rejectionReason } = data;
    handleRejectionGood({ id: row.id, rejectionReason });
  };

  return (
    <Modal isOpen={isOpen} size="xl" onClose={onClose} initialFocusRef={initialRef}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(useSubmit)}>
        <ModalHeader>방송인 정산정보 반려 하기</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="2fr 3fr" borderTopWidth={1.5} width={['100%', '70%']}>
            <GridTableItem title="방송인 활동명" value={row?.broadcaster?.userNickname} />
          </Grid>
          <FormControl m={2} mt={6} isInvalid={!!errors.rejectionReason}>
            <FormLabel fontSize="md">반려사유</FormLabel>
            <FormHelperText mb={2}>
              방송인 정산정보 승인 불가 사유를 입력해주세요.
            </FormHelperText>
            <Textarea
              isInvalid={!!errors.rejectionReason}
              minHeight="250px"
              resize="none"
              placeholder="예) 업로드한 통장사본의 계좌번호와 입력하신 계좌번호가 일치하지 않습니다"
              {...register('rejectionReason', {
                required: '반려 사유를 입력해주세요',
                validate: {
                  notEmpty: (v) => {
                    if (!v || /^\s*$/.test(v))
                      return '빈 문자는 반려사유가 될 수 없습니다';
                    return true;
                  },
                },
              })}
            />
            <FormErrorMessage>
              {errors.rejectionReason && errors.rejectionReason.message}
            </FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            type="submit"
            isLoading={isSubmitting}
            isDisabled={!watch('rejectionReason') || !!errors.rejectionReason}
          >
            반려하기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AdminBroadcasterSettlementInfoRejectionDialog;
