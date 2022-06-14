// 최초 입장시에 상점명을 입력하는 다이얼로그
// -> 추후에는 상점명 뿐 만 아니라 다른 것도 입력이 가능해야할 수 있음.
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  ButtonGroup,
  Grid,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { GridRowData } from '@material-ui/data-grid';
import { GridTableItem } from '@project-lc/components-layout/GridTableItem';
import { useGoodConfirmationMutation } from '@project-lc/hooks';
import { GoodsConfirmationStatus } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useRef } from 'react';

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
  row: GoodRowType | null;
  callback: () => void;
};

export function AdminGoodsConfirmationDialog(
  props: GoodsConfirmationDialogType,
): JSX.Element {
  const { isOpen, onClose, row, callback } = props;
  const toast = useToast();
  const initialRef = useRef(null);
  const mutation = useGoodConfirmationMutation();

  const handleSubmit = async (): Promise<void> => {
    if (!row) return;
    try {
      await mutation.mutateAsync({
        goodsId: row.id,
        status: GoodsConfirmationStatus.CONFIRMED,
      });
      toast({
        title: '상품 검수 승인이 완료되었습니다.',
        status: 'success',
      });
      onClose();
      callback();
    } catch (error) {
      toast({
        title: '상품 검수 승인이 실패하였습니다.',
        description: (error as AxiosError).response?.data.message,
        status: 'error',
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      size="md"
      onClose={onClose}
      initialFocusRef={initialRef}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>검수 승인 하기</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="2fr 3fr" borderTopWidth={1.5} width={['100%', '70%']}>
            <GridTableItem title="현재 상품명" value={row?.goods_name || ''} />
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
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button onClick={onClose}>취소</Button>
            <Button
              onClick={handleSubmit}
              isLoading={mutation.isLoading}
              isDisabled={!row?.agreementFlag || !row}
              colorScheme="blue"
            >
              승인하기
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
