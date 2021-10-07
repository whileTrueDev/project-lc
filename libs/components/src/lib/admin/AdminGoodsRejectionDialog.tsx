import { Button } from '@chakra-ui/button';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/modal';
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { GridRowData } from '@material-ui/data-grid';
import { useGoodRejectionMutation } from '@project-lc/hooks';
import { GoodsConfirmationStatus } from '@project-lc/shared-types';
import { useRouter } from 'next/router';
import { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { GridTableItem } from '../GridTableItem';
import { GoodRowType } from './AdminGoodsConfirmationDialog';

export interface AdminGoodsRejectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  row: GoodRowType | GridRowData;
}

type rejectionFormData = {
  rejectionReason: string;
};

export function AdminGoodsRejectionDialog({
  isOpen,
  onClose,
  row,
}: AdminGoodsRejectionDialogProps): JSX.Element {
  const toast = useToast();
  const router = useRouter();
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

  const rejectMutation = useGoodRejectionMutation();

  async function handleRejectionGood({
    goodsId,
    rejectionReason,
  }: {
    goodsId: number;
    rejectionReason: string;
  }): Promise<void> {
    try {
      await rejectMutation.mutateAsync({
        goodsId,
        rejectionReason,
        status: GoodsConfirmationStatus.REJECTED,
      });
      toast({
        title: '상품이 반려되었습니다.',
        status: 'success',
      });
      router.push('/goods');
    } catch (error) {
      toast({
        title: '상품 반려가 실패하였습니다.',
        status: 'error',
      });
    }
  }

  const useSubmit = (data: rejectionFormData): void => {
    const { rejectionReason } = data;
    handleRejectionGood({ goodsId: row.id, rejectionReason });
  };
  return (
    <Modal isOpen={isOpen} size="xl" onClose={onClose} initialFocusRef={initialRef}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(useSubmit)}>
        <ModalHeader>상품 반려 하기</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="2fr 3fr" borderTopWidth={1.5} width={['100%', '70%']}>
            <GridTableItem title="현재 상품명" value={row?.goods_name} />
          </Grid>
          <FormControl m={2} mt={6} isInvalid={!!errors.rejectionReason}>
            <FormLabel fontSize="md">반려사유</FormLabel>
            <FormHelperText>해당 상품의 승인 불가 사유를 입력해주세요.</FormHelperText>
            <Textarea
              isInvalid={!!errors.rejectionReason}
              minHeight="250px"
              resize="none"
              placeholder="예) 상품명과 상품 사진이 일치하지 않습니다"
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

export default AdminGoodsRejectionDialog;
