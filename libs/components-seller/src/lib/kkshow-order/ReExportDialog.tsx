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
  useDisclosure,
  useToast,
  Text,
  HStack,
  Stack,
  Box,
  FormControl,
  FormErrorMessage,
  Input,
  Select,
  useColorModeValue,
  Image,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import TextDotConnector from '@project-lc/components-core/TextDotConnector';
import {
  checkShippingCanExport,
  checkShippingExportIsDone,
  useExportOrderMutation,
  useOrderExportableCheck,
  useProfile,
} from '@project-lc/hooks';
import {
  CreateKkshowExportDto,
  ExchangeDataWithImages,
  OrderDetailRes,
} from '@project-lc/shared-types';
import { sellerExportStore } from '@project-lc/stores';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { deliveryCompanies, getLocaleNumber } from '@project-lc/utils-frontend';
import ExportOrderOptionList from '../ExportOrderOptionList';

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
  // 이미 출고가 끝난 주문인 지 체크
  const { isDone } = useOrderExportableCheck(order);
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
        amount: item.amount,
      })),
    },
  });
  const {
    register,
    formState: { errors },
    trigger,
  } = formMethods;
  const exportOrder = useExportOrderMutation();

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

  /** 개별 출고 처리 */
  const onExportOneOrder = useCallback(async () => {
    const isValid = true;
    if (isValid) {
      const dto = formMethods.getValues();
      const result = await trigger();
      console.log(dto, result);
      // const realDto = { ...dto, items: dto.items.filter((x) => !!x.amount) };
      // // 보낼 수량이 0개 인지 체크
      // if (realDto.items.every((o) => Number(o.amount) === 0)) {
      //   toast({
      //     status: 'warning',
      //     description:
      //       '모든 주문상품의 보낼 수량이 0 입니다. 보낼 수량을 올바르게 입력해주세요.',
      //   });
      // } else {
      //   // 출고 처리 API 요청
      //   exportOrder.mutateAsync(realDto).then(onExportSuccess).catch(onExportFail);
      // }
    }
  }, [formMethods, trigger]);

  const processReExport = (): void => {
    const dto = formMethods.getValues();
    console.log(dto, exchangeData.exchangeItems);
    console.log('재출고버튼 클릭');
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
        <ModalContent as="form">
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
                      <Th />
                      <Th>상품명</Th>
                      <Th>옵션</Th>
                      <Th>요청수량</Th>
                      <Th>보낼수량</Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {/* 재배송 요청 상품 */}
                    {exchangeData.exchangeItems.map((exchangeItem, index) => {
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
                            <Text>{exchangeItem.amount} 개 </Text>
                          </Td>

                          <Td>
                            <FormControl
                              isInvalid={!!(errors.items && errors.items[index]?.amount)}
                            >
                              <Input
                                {...register(`items.${index}.amount`, {
                                  required: '보낼 수량을 입력해주세요.',
                                  valueAsNumber: true,
                                  min: { value: 0, message: '0보다 작을 수 없습니다.' },
                                  max: {
                                    value: exchangeItem.amount,
                                    message: '요청 수량 보다 클 수 없습니다.',
                                  },
                                })}
                                w="60px"
                              />
                              <FormErrorMessage fontSize="xs">
                                {errors.items &&
                                  errors.items[index]?.amount &&
                                  errors.items[index]?.amount?.message}
                              </FormErrorMessage>
                            </FormControl>
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
                        // required: { message: '택배사를 선택하세요.' },
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
                        // required: { message: '송장번호를 입력하세요.' },
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
                    onClick={() => {
                      processReExport();
                    }}
                    // type="submit"
                  >
                    출고처리
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </ModalBody>
        </ModalContent>
      </FormProvider>
    </Modal>
  );
}

export default ReExportDialog;

/** 재배송요청 정보 중 재출고시 필요한 정보 - 주소& 배송메모는 재배송 요청시 받은 정보 표시, 나머지는 원래 주문시 기입했던 정보 표시 */
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
          {exchangeData.recipientAddress} {exchangeData.recipientDetailAddress || ''}
        </Text>
        <Text fontSize="sm">
          {order.recipientName} {order.recipientPhone}
        </Text>
      </HStack>
      {exchangeData.memo && (
        <HStack>
          <Text fontSize="sm">(배송메시지) {exchangeData.memo}</Text>
        </HStack>
      )}
    </Stack>
  );
}
