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
} from '@chakra-ui/react';
import { GridRowData } from '@material-ui/data-grid';
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<rejectionFormData>();

  const initialRef = useRef(null);

  useEffect(() => {
    reset();
  }, [reset, row]);

  const useSubmit = (data: rejectionFormData): void => {
    console.log(data);
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
          <FormControl isInvalid={!!errors.rejectionReason} m={2} mt={6}>
            <FormLabel fontSize="md">반려사유</FormLabel>
            <FormHelperText>해당 상품의 승인 불가 사유를 입력해주세요.</FormHelperText>
            <Textarea {...register('rejectionReason', { required: true })} />
            <FormErrorMessage>
              {errors.rejectionReason && errors.rejectionReason.message}
            </FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" isLoading={isSubmitting}>
            반려하기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AdminGoodsRejectionDialog;
