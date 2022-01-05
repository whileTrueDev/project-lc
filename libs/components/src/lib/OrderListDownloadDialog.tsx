import { DownloadIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  FormControl,
  FormLabel,
  GridItem,
  Input,
  InputGroup,
  InputRightAddon,
  LayoutProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useFmOrderDetails } from '@project-lc/hooks';
import { defaultColumOpts, OrderSpreadSheetGenerator } from '@project-lc/shreadsheet';
import {
  getOrderDownloadFileName,
  useFmOrderStore,
  useOrderListDownloadStore,
} from '@project-lc/stores';
import { useState } from 'react';

export interface OrderListDownloadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
export function OrderListDownloadDialog({
  isOpen,
  onClose,
}: OrderListDownloadDialogProps): JSX.Element {
  const toast = useToast();
  // 선택된 주문
  const selectedOrders = useFmOrderStore((state) => state.selectedOrders);
  // 선택된 주문 상세 정보 조회
  const orderDetails = useFmOrderDetails({ orderIds: selectedOrders });

  const disableHeaders = useOrderListDownloadStore((st) => st.disableHeaders);
  const fileName = useOrderListDownloadStore((st) => st.fileName);

  // 엑셀 생성 및 내보내기
  const onConfirm = async (): Promise<void> => {
    if (orderDetails.data) {
      const ossg = new OrderSpreadSheetGenerator({
        disabledColumnHeaders: disableHeaders,
      });
      const workbook = ossg.createXLSX(orderDetails.data);
      ossg
        .download(`${fileName || getOrderDownloadFileName()}.xlsx`, workbook)
        .then(() => {
          toast({ status: 'success', title: '주문목록 다운로드 완료' });
          onClose();
        })
        .catch(() => {
          toast({
            status: 'error',
            title: '주문목록 다운로드중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          });
        });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>주문 내보내기</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {orderDetails.isLoading && <OrderListDownloadLoading />}
          {!orderDetails.isLoading && orderDetails.data && (
            <OrderListDownloadSetting targetOrderIds={selectedOrders} />
          )}
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button
              isDisabled={orderDetails.isLoading || !orderDetails.data}
              rightIcon={<DownloadIcon />}
              colorScheme="blue"
              onClick={onConfirm}
            >
              다운로드
            </Button>
            <Button onClick={onClose}>취소</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function OrderListDownloadLoading(): JSX.Element {
  return (
    <Alert
      status="info"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="160px"
    >
      <Spinner boxSize="40px" mr={0} color="blue.500" speed="0.65s" />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        잠시만 기다려주세요!
      </AlertTitle>
      <AlertDescription>주문정보를 불러오고 있습니다.</AlertDescription>
    </Alert>
  );
}

export default OrderListDownloadDialog;

interface OrderListDownloadSettingProps {
  targetOrderIds: Array<string | number>;
}
function OrderListDownloadSetting({
  targetOrderIds,
}: OrderListDownloadSettingProps): JSX.Element {
  const [overflow, setOverflow] = useState<LayoutProps['overflowX']>('hidden');
  const { fileName, setFileName } = useOrderListDownloadStore();

  return (
    <Stack>
      <Text>선택된 주문 총 {targetOrderIds.length} 개</Text>
      <Box>
        <Box overflowX={overflow} isTruncated={overflow === 'hidden'}>
          {targetOrderIds.map((orderId) => (
            <Badge mr={1} key={orderId}>
              {orderId}
            </Badge>
          ))}
        </Box>
        <Button
          variant="link"
          size="xs"
          onClick={() => {
            setOverflow((prev) => (prev === 'hidden' ? 'unset' : 'hidden'));
          }}
        >
          {overflow === 'hidden' ? '펼치기' : '접기'}
        </Button>
      </Box>

      <Box>
        <FormControl>
          <FormLabel>파일명</FormLabel>
          <InputGroup maxW={300}>
            <Input value={fileName} onChange={(e) => setFileName(e.target.value)} />
            <InputRightAddon>.xlsx</InputRightAddon>
          </InputGroup>
        </FormControl>
      </Box>

      <Box pt={2}>
        주문정보
        <OrderListDownloadFieldSetting
          fields={defaultColumOpts
            .filter((x) => x.type === '주문정보')
            .map((x) => x.headerName)}
        />
      </Box>

      <Box pt={2}>
        주문상품정보
        <OrderListDownloadFieldSetting
          fields={defaultColumOpts
            .filter((x) => x.type === '상품정보')
            .map((x) => x.headerName)}
        />
      </Box>
    </Stack>
  );
}

interface OrderListDownloadFieldSettingProps {
  fields: string[];
}
function OrderListDownloadFieldSetting({
  fields,
}: OrderListDownloadFieldSettingProps): JSX.Element {
  const { disableHeaders, toggleDisableHeaders } = useOrderListDownloadStore();
  return (
    <SimpleGrid pt={1} columns={4}>
      {fields.map((header) => (
        <GridItem key={header}>
          <Checkbox
            value={header}
            defaultChecked
            checked={!disableHeaders.includes(header)}
            onChange={(e) => {
              toggleDisableHeaders(e.target.value);
            }}
          >
            {header}
          </Checkbox>
        </GridItem>
      ))}
    </SimpleGrid>
  );
}
