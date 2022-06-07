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
  Image,
} from '@chakra-ui/react';
import { Return } from '@prisma/client';
import { ExchangeReturnCancelRequestStatusBadge } from '@project-lc/components-shared/order/ExchangeReturnCancelRequestStatusBadge';
import { ExchangeReturnCancelRequestGoodsData } from '@project-lc/components-shared/order/ExchangeReturnCancelRequestGoodsData';
import { RelatedRefundData } from '@project-lc/components-shared/order/RelatedRefundData';
import { useReturnDetail, useUpdateReturnMutation } from '@project-lc/hooks';
import { ReturnDataWithImages } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { AiFillWarning } from 'react-icons/ai';
import { RiErrorWarningFill } from 'react-icons/ri';

interface OrderRetusnStatusForm {
  status: Return['status'];
  rejectReason?: Return['rejectReason'];
}

export interface OrderReturnStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReturnDataWithImages;
}

const RETURN_TEXT = '반품(환불)';

export function OrderReturnStatusDialog({
  isOpen,
  onClose,
  data,
}: OrderReturnStatusDialogProps): JSX.Element {
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderRetusnStatusForm>();
  const { mutateAsync } = useUpdateReturnMutation();
  const toast = useToast();
  const onSuccess = (): void => {
    toast({
      title: `${RETURN_TEXT} 상태를 변경하였습니다`,
      status: 'success',
    });
  };

  const onFail = (): void => {
    toast({
      title: `${RETURN_TEXT} 상태 변경 중 오류가 발생하였습니다`,
      status: 'error',
    });
  };

  async function onSubmit(formData: OrderRetusnStatusForm): Promise<void> {
    const { status, rejectReason } = formData;
    const dto = {
      status,
      rejectReason: rejectReason || undefined,
    };

    await mutateAsync({
      returnId: data.id,
      dto,
    })
      .then(onSuccess)
      .catch(onFail);
    onClose();
  }

  const { data: returnDetail, isLoading } = useReturnDetail(data.returnCode || '');
  const requestDate = returnDetail ? dayjs(data.requestDate).format('YYYY-MM-DD') : '';
  const completeDate =
    returnDetail && returnDetail.completeDate
      ? dayjs(data.completeDate).format('YYYY-MM-DD')
      : '';
  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }
  if (!returnDetail) {
    return (
      <Text>
        해당 {RETURN_TEXT}신청 내역이 존재하지 않습니다 {RETURN_TEXT}신청코드:{' '}
        {data.returnCode}
      </Text>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="3xl">
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>{RETURN_TEXT} 상태 관리</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
            {/* 반품정보 */}
            <Stack spacing={1} my={2}>
              <Stack direction="row" justifyContent="space-between">
                <Stack>
                  <Text fontWeight="bold">{RETURN_TEXT}요청코드</Text>
                  <Text pl={4}>{returnDetail.returnCode}</Text>
                </Stack>
              </Stack>

              <Stack>
                <Text fontWeight="bold">{RETURN_TEXT}요청 처리상태</Text>

                <Stack pl={4}>
                  <Stack direction="row" alignItems="center">
                    <ExchangeReturnCancelRequestStatusBadge
                      status={returnDetail.status}
                    />
                  </Stack>
                  {returnDetail.rejectReason && (
                    <Text pl={4}>
                      {RETURN_TEXT}요청 거절 사유 : {returnDetail.rejectReason}
                    </Text>
                  )}

                  <Text>요청일 : {requestDate}</Text>
                  <Stack pl={4}>
                    <Text>
                      {RETURN_TEXT}요청 사유 : {returnDetail.reason}
                    </Text>
                    {returnDetail.images.length && (
                      <>
                        <Text>{RETURN_TEXT}요청 이미지 : </Text>
                        {returnDetail.images.map((img) => (
                          <Image
                            maxW="400px"
                            maxH="300px"
                            src={img.imageUrl}
                            key={img.id}
                          />
                        ))}
                      </>
                    )}
                  </Stack>

                  {completeDate && <Text>완료일 : {completeDate}</Text>}
                </Stack>
              </Stack>

              <Stack>
                <Text fontWeight="bold">{RETURN_TEXT}요청한 주문상품</Text>
                <Stack pl={4}>
                  {returnDetail.items.map((item) => (
                    <ExchangeReturnCancelRequestGoodsData key={item.id} {...item} />
                  ))}
                </Stack>
              </Stack>

              {/* 환불정보 */}
              <RelatedRefundData
                refund={returnDetail.refund}
                estimatedRefundAmount={returnDetail.items
                  .map((item) => item.price)
                  .reduce((sum, price) => sum + price, 0)}
              />
            </Stack>

            {/* 반품상태변경 */}
            <Stack spacing={1} my={2}>
              {watch('status') === 'complete' && (
                <Alert mb={2} status="warning">
                  <List spacing={3}>
                    <ListItem>
                      <ListIcon as={RiErrorWarningFill} color="orange.500" />
                      {RETURN_TEXT}완료 선택시, 실제 환불이 진행되므로 반드시 물품 수령 및
                      확인 후,
                      {RETURN_TEXT}완료를 선택하세요.
                    </ListItem>
                    <ListItem>
                      <ListIcon as={AiFillWarning} color="red.500" />
                      {RETURN_TEXT} 완료 등록 후,{' '}
                      <Text as="span" color="red.500" fontWeight="bold">
                        이전 단계로의 변경은 불가
                      </Text>
                      합니다.
                    </ListItem>
                  </List>
                </Alert>
              )}
              <FormControl isInvalid={!!errors.status}>
                <FormLabel>변경할 {RETURN_TEXT} 상태</FormLabel>
                <Select
                  placeholder={`변경할 ${RETURN_TEXT} 상태를 선택하세요.`}
                  {...register('status', {
                    required: {
                      value: true,
                      message: `변경할 ${RETURN_TEXT} 상태를 선택해주세요.`,
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
                  <FormLabel>{RETURN_TEXT}요청 거절 사유</FormLabel>
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
                    <AlertTitle>이 {RETURN_TEXT}은 완료 처리되었습니다.</AlertTitle>
                    <AlertDescription>
                      환불 진행 정보는 환불정보에서 확인해주세요.
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

export default OrderReturnStatusDialog;