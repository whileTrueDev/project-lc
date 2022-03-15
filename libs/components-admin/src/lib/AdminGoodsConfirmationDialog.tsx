// 최초 입장시에 상점명을 입력하는 다이얼로그
// -> 추후에는 상점명 뿐 만 아니라 다른 것도 입력이 가능해야할 수 있음.
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Stack,
  useMergeRefs,
  useToast,
  HStack,
} from '@chakra-ui/react';
import { GridRowData } from '@material-ui/data-grid';
import { GridTableItem } from '@project-lc/components-layout/GridTableItem';
import { useGoodConfirmationMutation } from '@project-lc/hooks';
import { GoodsConfirmationStatus } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';

export function FmGoodsSeqInputHelpText(): JSX.Element {
  return (
    <>
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
    </>
  );
}

// 검수 승인시에 필요한 최소한의 데이터
export interface GoodRowType extends GridRowData {
  id: number;
  goods_name: string;
  name: string;
  agreementFlag: boolean;
}

type GoodsConfirmationDialogType = {
  isOpen: boolean;
  onClose: () => void;
  row: GoodRowType;
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
  const toast = useToast();
  const initialRef = useRef(null);
  const { ref, ...firstmallGoodsConnectionId } = register('firstmallGoodsConnectionId', {
    required: '상품 ID를 반드시 입력해주세요.',
  });
  const connectionIdRefs = useMergeRefs(initialRef, ref);

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
      reset();
      onClose();
      callback();
    } catch (error) {
      toast({
        title: '상품 검수 승인이 실패하였습니다.',
        description: (error as AxiosError).response?.data.message,
        status: 'error',
      });
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
          {!row?.agreementFlag && (
            <Alert status="error" mt={2}>
              <Stack>
                <HStack>
                  <AlertIcon />
                  <AlertTitle>이용동의를 하지 않은 사용자입니다</AlertTitle>
                </HStack>
                <AlertDescription>
                  해당 판매자(<b>{row?.name}</b>)는 이용 약관에 동의를 하지 않았으므로
                  상품 승인을 할 수 없습니다.
                </AlertDescription>
              </Stack>
            </Alert>
          )}
          <FormControl isInvalid={!!errors.firstmallGoodsConnectionId} m={2} mt={6}>
            <FormLabel fontSize="md">상품 ID</FormLabel>
            <FormHelperText>
              <FmGoodsSeqInputHelpText />
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
              {...firstmallGoodsConnectionId}
              ref={connectionIdRefs}
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
            isDisabled={!watch('firstmallGoodsConnectionId') || !row?.agreementFlag}
          >
            승인하기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
