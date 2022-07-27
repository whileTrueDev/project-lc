import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { OrderCancellation } from '@prisma/client';
import { ExchangeReturnCancelRequestGoodsData } from '@project-lc/components-shared/order/ExchangeReturnCancelRequestGoodsData';
import { ExchangeReturnCancelRequestStatusBadge } from '@project-lc/components-shared/order/ExchangeReturnCancelRequestStatusBadge';
import RelatedRefundData from '@project-lc/components-shared/order/RelatedRefundData';
import {
  useCustomerOrderCancellationDetail,
  useUpdateOrderCancelMutation,
} from '@project-lc/hooks';
import { OrderCancellationBaseData } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { AiFillWarning } from 'react-icons/ai';
import { RiErrorWarningFill } from 'react-icons/ri';

interface OrderCencelStatusForm {
  status: OrderCancellation['status'];
  rejectReason?: OrderCancellation['rejectReason'];
}

export interface OrderCancelStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: OrderCancellationBaseData;
}
export function OrderCancelStatusDialog({
  isOpen,
  onClose,
  data,
}: OrderCancelStatusDialogProps): JSX.Element {
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderCencelStatusForm>();
  const { mutateAsync } = useUpdateOrderCancelMutation();
  const toast = useToast();
  const onSuccess = (): void => {
    toast({
      title: '주문취소 상태를 변경하였습니다',
      status: 'success',
    });
  };

  const onFail = (): void => {
    toast({
      title: '주문취소 상태 변경 중 오류가 발생하였습니다',
      status: 'error',
    });
  };

  async function onSubmit(formData: OrderCencelStatusForm): Promise<void> {
    const { status, rejectReason } = formData;
    const dto = {
      status,
      rejectReason: rejectReason || undefined,
    };

    await mutateAsync({
      orderCancelId: data.id,
      dto,
    })
      .then(onSuccess)
      .catch(onFail);
    onClose();
  }

  const { data: cancelDetail, isLoading } = useCustomerOrderCancellationDetail(
    data.cancelCode || '',
  );
  const requestDate = cancelDetail ? dayjs(data.requestDate).format('YYYY-MM-DD') : '';
  const completeDate =
    cancelDetail && cancelDetail.completeDate
      ? dayjs(data.completeDate).format('YYYY-MM-DD')
      : '';
  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }
  if (!cancelDetail) {
    return (
      <Text>해당 주문취소 내역이 존재하지 않습니다 주문취소코드: {data.cancelCode}</Text>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="3xl">
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>주문취소 상태 관리</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
            {/* 반품정보 */}
            <Stack spacing={1} my={2}>
              <Stack direction="row" justifyContent="space-between">
                <Stack>
                  <Text fontWeight="bold">주문취소 요청코드</Text>
                  <Text pl={4}>{cancelDetail.cancelCode}</Text>
                </Stack>
              </Stack>

              <Stack>
                <Text fontWeight="bold">주문취소 요청 처리상태</Text>

                <Stack pl={4}>
                  <Stack direction="row" alignItems="center">
                    <ExchangeReturnCancelRequestStatusBadge
                      status={cancelDetail.status}
                    />
                  </Stack>
                  {cancelDetail.rejectReason && (
                    <Text pl={4}>
                      주문취소 요청 거절 사유 : {cancelDetail.rejectReason}
                    </Text>
                  )}

                  <Text>요청일 : {requestDate}</Text>

                  {completeDate && <Text>완료일 : {completeDate}</Text>}
                </Stack>
              </Stack>

              <Stack>
                <Text fontWeight="bold">주문취소 요청한 주문상품</Text>
                <Stack pl={4}>
                  {cancelDetail.items.map((item) => (
                    <ExchangeReturnCancelRequestGoodsData key={item.id} {...item} />
                  ))}
                </Stack>
              </Stack>

              {/* 주문취소 정보 */}
              <RelatedRefundData
                refund={cancelDetail.refund}
                estimatedRefundAmount={
                  // 주문취소하려는 주문이 결제승인이 완료된 상태였다면 예상환불금액은 상품 전체 가격 합 표시, 아니면 0 원
                  cancelDetail.order?.payment?.depositDoneFlag
                    ? cancelDetail.items
                        .map((item) => item.price * item.quantity) // 취소상품 개수 * 가격
                        .reduce((sum, price) => sum + price, 0)
                    : 0
                }
              />
            </Stack>

            {/* 주문취소 상태변경 */}
            <Stack spacing={1} my={2}>
              {watch('status') === 'complete' && (
                <Alert mb={2} status="warning">
                  <List spacing={3}>
                    <ListItem>
                      <ListIcon as={RiErrorWarningFill} color="orange.500" />
                      주문취소 완료 선택시, 환불이 진행되므로 반드시 물품 수령 및 확인 후,
                      주문취소 완료를 선택하세요.
                    </ListItem>
                    <ListItem>
                      <ListIcon as={AiFillWarning} color="red.500" />
                      주문취소 완료 등록 후,{' '}
                      <Text as="span" color="red.500" fontWeight="bold">
                        이전 단계로의 변경은 불가
                      </Text>
                      합니다.
                    </ListItem>
                  </List>
                </Alert>
              )}
              <FormControl isInvalid={!!errors.status}>
                <FormLabel>변경할 주문취소 상태</FormLabel>
                <Select
                  placeholder="변경할 주문취소  상태를 선택하세요."
                  {...register('status', {
                    required: {
                      value: true,
                      message: '변경할 주문취소  상태를 선택해주세요.',
                    },
                  })}
                  isDisabled={data.status === 'complete'}
                >
                  <option value="requested">요청됨(초기 상태, 담당자 확인전)</option>
                  <option value="processing">처리진행중(담당자 확인 후 처리 중)</option>
                  <option value="complete">처리완료</option>
                  <option value="canceled">취소(거절)</option>
                </Select>
                {errors.status && (
                  <FormErrorMessage>{errors.status.message}</FormErrorMessage>
                )}
              </FormControl>

              {/* 거절사유 */}
              {watch('status') === 'canceled' && (
                <FormControl isInvalid={!!errors.rejectReason}>
                  <FormLabel>주문취소 요청 거절 사유</FormLabel>
                  <Input {...register('rejectReason')} />
                  {errors.rejectReason && (
                    <FormErrorMessage>{errors.rejectReason.message}</FormErrorMessage>
                  )}
                </FormControl>
              )}

              {data.status === 'complete' && (
                <Alert mt={6} mb={2} status="info">
                  <Stack alignItems="center" justify="center" w="100%">
                    <AlertIcon />
                    <AlertTitle>이 주문취소 요청은 완료 처리되었습니다.</AlertTitle>
                    <AlertDescription>
                      주문취소 진행 정보는 주문취소 정보에서 확인해주세요.
                    </AlertDescription>
                  </Stack>
                </Alert>
              )}
            </Stack>
          </SimpleGrid>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            취소
          </Button>
          <Button
            colorScheme="blue"
            type="submit"
            isDisabled={data.status === 'complete'}
          >
            확인
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default OrderCancelStatusDialog;
