import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import TextDotConnector from '@project-lc/components-core/TextDotConnector';
import { useExportOrderMutation, useProfile } from '@project-lc/hooks';
import {
  CreateKkshowExportDto,
  ExchangeDataWithImages,
  OrderDetailRes,
} from '@project-lc/shared-types';
import { deliveryCompanies } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

type ReExportData = CreateKkshowExportDto;

export interface ReExportDialogProps {
  isOpen: ModalProps['isOpen'];
  onClose: ModalProps['onClose'];
  order: OrderDetailRes;
  exchangeData: ExchangeDataWithImages; // 재배송 요청 정보
}

export function ReExportDialog({
  isOpen,
  onClose,
  order,
  exchangeData,
}: ReExportDialogProps): JSX.Element {
  const { data: profileData } = useProfile();
  const submitBtnVariant = useColorModeValue('solid', 'outline');

  const toast = useToast();
  const formMethods = useForm<ReExportData>({
    defaultValues: {
      orderId: order.id,
      sellerId: profileData?.id,
      items: exchangeData.exchangeItems.map((item) => ({
        orderItemId: item.orderItemId,
        orderItemOptionId: item.orderItemOptionId,
        quantity: item.quantity,
      })),
    },
  });
  const {
    register,
    formState: { errors },
  } = formMethods;

  const onExportSuccess = useCallback(() => {
    toast({ status: 'success', description: '출고 처리가 성공적으로 완료되었습니다.' });
    onClose();
  }, [onClose, toast]);

  const onExportFail = useCallback(
    (err: any) => {
      toast({
        status: 'error',
        description: '출고 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
      throw err;
    },
    [toast],
  );

  const exportOrder = useExportOrderMutation();

  const processReExport = (data: ReExportData): void => {
    // 출고처리할 상품의 판매자id 조회 => export.sellerId로 저장
    const itemIds = data.items.map((i) => i.orderItemId);
    const sellerId = order.orderItems.find((oi) => itemIds.includes(oi.id))?.goods
      ?.sellerId;

    const dto = {
      ...data,
      sellerId,
      exchangeExportedFlag: true, // 재출고 처리
      exchangeId: exchangeData.id, // 재출고와 연결할 교환요청 고유번호
    };
    exportOrder.mutateAsync(dto).then(onExportSuccess).catch(onExportFail);
  };

  const orderItemOptions = order.orderItems.flatMap((item) => item.options);

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
        <ModalContent as="form" onSubmit={formMethods.handleSubmit(processReExport)}>
          <ModalHeader>{order.orderCode} 재배송 요청에 대한 출고 처리</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* 재배송 위한 주문 메타 정보 */}
            <ExchangeRequestSummary order={order} exchangeData={exchangeData} />

            {/* 주문 상품 정보 및 출고처리 란 */}
            <Stack mt={4} direction="row" alignItems="center">
              {/* 주문 상품 정보 */}
              <Stack flex={3}>
                <Table>
                  <Thead>
                    <Tr>
                      {/* 이미지 */}
                      <Th />
                      <Th>상품명</Th>
                      <Th>옵션</Th>
                      <Th>요청수량</Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {/* 재배송 요청 상품 */}
                    {exchangeData.exchangeItems.map((exchangeItem) => {
                      const orderItem = order.orderItems.find(
                        (oi) => oi.id === exchangeItem.orderItemId,
                      );
                      const option = orderItemOptions.find(
                        (o) => o.id === exchangeItem.orderItemOptionId,
                      );
                      if (!option || !orderItem) return null;
                      return (
                        <Tr key={exchangeItem.id}>
                          {/* 이미지 */}
                          <Td>
                            <Image
                              objectFit="cover"
                              w="50px"
                              h="50px"
                              rounded="md"
                              draggable={false}
                              src={orderItem?.goods.image?.[0]?.image}
                            />
                          </Td>
                          <Td>
                            <Text maxW={120} fontSize="sm" noOfLines={3}>
                              {orderItem?.goods.goods_name}
                            </Text>
                          </Td>

                          <Td>
                            <Text>
                              {option.name} : {option.value}
                            </Text>
                          </Td>
                          <Td>
                            <Text>{exchangeItem.quantity} 개 </Text>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </Stack>

              {/* 출고처리 란  */}
              <Box flex={1}>
                <Stack>
                  {/* 택배사 선택 */}
                  <FormControl isInvalid={!!errors.deliveryCompany}>
                    <Select
                      {...register(`deliveryCompany`, {
                        required: '택배사를 선택하세요',
                      })}
                      placeholder="택배사 선택"
                    >
                      {deliveryCompanies.map((company) => (
                        <option key={company.company} value={company.company}>
                          {company.company}
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage>
                      {errors.deliveryCompany && errors.deliveryCompany?.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* 송장번호 입력 */}
                  <FormControl isInvalid={!!errors.deliveryNumber}>
                    <Input
                      {...register(`deliveryNumber`, {
                        required: '송장번호를 입력하세요.',
                      })}
                      placeholder="송장번호"
                    />
                    <FormErrorMessage>
                      {errors.deliveryNumber && errors.deliveryNumber?.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* 출고처리 */}
                  <Button
                    variant={submitBtnVariant}
                    colorScheme="pink"
                    size="sm"
                    type="submit"
                  >
                    출고처리
                  </Button>
                </Stack>
              </Box>
            </Stack>
            <Alert status="info" mt={4}>
              <AlertIcon />
              <AlertTitle mr={2}>
                출고처리 후 교환(재배송) 상태를 &quot;완료&quot;로 변경해주세요!
              </AlertTitle>
            </Alert>
          </ModalBody>
        </ModalContent>
      </FormProvider>
    </Modal>
  );
}

export default ReExportDialog;

/** 재배송요청 정보 중 재출고시 필요한 정보
 * - 주소& 배송메모는 재배송 요청시 받은 정보 표시
 * - 나머지는 원래 주문시 기입했던 정보 표시
 * */
function ExchangeRequestSummary({
  exchangeData,
  order,
}: {
  exchangeData: ExchangeDataWithImages;
  order: OrderDetailRes;
}): JSX.Element {
  return (
    <Stack spacing={1}>
      <HStack alignItems="center" flexWrap="nowrap">
        <Text fontSize="sm">{order.orderCode}</Text>
        <TextDotConnector />
        <Text fontSize="sm" ml={2}>
          {dayjs(order.createDate).fromNow()}
        </Text>
      </HStack>
      <HStack>
        <Text fontSize="sm">
          {exchangeData.recipientAddress} {exchangeData.recipientDetailAddress || ''} (
          {exchangeData.recipientPostalCode})
        </Text>
        <Text fontSize="sm">
          {order.recipientName} {order.recipientPhone}
        </Text>
      </HStack>
      {exchangeData.memo && (
        <HStack>
          <Text fontSize="sm">(배송메시지) {exchangeData.recipientShippingMemo}</Text>
        </HStack>
      )}
    </Stack>
  );
}
