// 최초 입장시에 상점명을 입력하는 다이얼로그
// -> 추후에는 상점명 뿐 만 아니라 다른 것도 입력이 가능해야할 수 있음.
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  Grid,
} from '@chakra-ui/react';
import { GoodsConfirmationStatus, GoodsListRes } from '@project-lc/shared-types';
import { useGoodConfirmationMutation } from '@project-lc/hooks';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { GridRowData } from '@material-ui/data-grid';
import { QueryObserverResult } from 'react-query';
import { GridTableItem } from '../GridTableItem';

type GoodsConfirmationDialogType = {
  isOpen: boolean;
  onClose: () => void;
  row: GridRowData;
  refetch: () => Promise<QueryObserverResult<GoodsListRes, unknown>>;
};

export function AdminGoodsConfirmationDialog(
  props: GoodsConfirmationDialogType,
): JSX.Element {
  const { isOpen, onClose, row, refetch } = props;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const initialRef = useRef(null);
  const toast = useToast();

  function useClose() {
    reset();
    onClose();
    refetch();
  }

  const mutation = useGoodConfirmationMutation();
  async function useSubmit(submitData: { firstmallGoodsConnectionId: string }) {
    try {
      await mutation.mutateAsync({
        goodsId: row.id,
        firstmallGoodsConnectionId: parseInt(submitData.firstmallGoodsConnectionId, 10),
        status: GoodsConfirmationStatus.CONFIRMED,
      });
      toast({
        title: '상점명 등록이 완료되었습니다.',
        status: 'success',
      });
    } catch (error) {
      toast({
        title: '상점명 등록이 실패하였습니다.',
        description: error.response.data.message,
        status: 'error',
      });
    } finally {
      useClose();
    }
  }

  return (
    <Modal isOpen={isOpen} size="md" onClose={useClose} initialFocusRef={initialRef}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(useSubmit)}>
        <ModalHeader>검수 승인 하기</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="2fr 3fr" borderTopWidth={1.5} width={['100%', '70%']}>
            <GridTableItem title="현재 상품명" value={row?.goods_name} />
          </Grid>
          <FormControl isInvalid={!!errors.firstmallGoodsConnectionId} m={2} mt={6}>
            <FormLabel fontSize="md">상품 ID</FormLabel>
            <FormHelperText>
              퍼스트몰에 등록한 상품의 고유번호를
              입력하세요.(http://whiletrue.firstmall.kr/goods/view?no=41 의 41을 입력)
            </FormHelperText>
            <Input
              id="firstmallGoodsConnectionId"
              variant="flushed"
              maxW={['inherit', 300, 300, 300]}
              mt={3}
              maxLength={20}
              autoComplete="off"
              placeholder="승인할 상품 ID를 입력 하세요."
              {...register('firstmallGoodsConnectionId', {
                required: '상품 ID를 반드시 입력해주세요.',
                pattern: {
                  value: /^[0-9]*$/,
                  message: '반드시 숫자만 입력하세요.',
                },
              })}
              ref={initialRef}
            />
            <FormErrorMessage>
              {errors.firstmallGoodsConnectionId &&
                errors.firstmallGoodsConnectionId.message}
            </FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" isLoading={isSubmitting}>
            승인하기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
