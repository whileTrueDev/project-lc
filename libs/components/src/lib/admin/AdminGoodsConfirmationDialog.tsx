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
  Text,
} from '@chakra-ui/react';
import { GoodsConfirmationStatus } from '@project-lc/shared-types';
import { useGoodConfirmationMutation } from '@project-lc/hooks';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { GridRowData } from '@material-ui/data-grid';
import { AxiosError } from 'axios';
import { GridTableItem } from '../GridTableItem';

// 검수 승인시에 필요한 최소한의 데이터
export type GoodRowType = { id: number; goods_name: string };

type GoodsConfirmationDialogType = {
  isOpen: boolean;
  onClose: () => void;
  row: GoodRowType | GridRowData;
  callback: () => void;
};

export function AdminGoodsConfirmationDialog(
  props: GoodsConfirmationDialogType,
): JSX.Element {
  const { isOpen, onClose, row, callback } = props;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();
  const initialRef = useRef(null);
  const toast = useToast();

  function useClose(): void {
    reset();
    onClose();
    callback();
  }

  const mutation = useGoodConfirmationMutation();
  async function useSubmit(submitData: {
    firstmallGoodsConnectionId: string;
  }): Promise<void> {
    try {
      await mutation.mutateAsync({
        goodsId: row.id,
        firstmallGoodsConnectionId: parseInt(submitData.firstmallGoodsConnectionId, 10),
        status: GoodsConfirmationStatus.CONFIRMED,
      });
      toast({
        title: '상품 검수 승인이 완료되었습니다.',
        status: 'success',
      });
    } catch (error) {
      toast({
        title: '상품 검수 승인이 실패하였습니다.',
        description: (error as AxiosError).response?.data.message,
        status: 'error',
      });
    } finally {
      useClose();
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      size="md"
      onClose={() => {
        reset();
        onClose();
      }}
      initialFocusRef={initialRef}
    >
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
              입력하세요.(http://whiletrue.firstmall.kr/goods/view?no=
              <Text as="span" color="red">
                41
              </Text>
              의&nbsp;
              <Text as="span" color="red">
                41
              </Text>
              을 입력)
            </FormHelperText>
            <Input
              id="firstmallGoodsConnectionId"
              variant="flushed"
              maxW={['inherit', 300, 300, 300]}
              mt={3}
              maxLength={20}
              autoComplete="off"
              type="number"
              placeholder="승인할 상품 ID를 입력 하세요."
              {...register('firstmallGoodsConnectionId', {
                required: '상품 ID를 반드시 입력해주세요.',
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
          <Button
            type="submit"
            isLoading={isSubmitting}
            isDisabled={!watch('firstmallGoodsConnectionId')}
          >
            승인하기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
