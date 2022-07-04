import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Grid,
  GridItem,
  Input,
  Link,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { CardDetail } from '@project-lc/components-shared/payment/CardDetail';
import { TransferDetail } from '@project-lc/components-shared/payment/TransferDetail';
import { VirtualAccountDetail } from '@project-lc/components-shared/payment/VirtualAccountDetail';
import { useCreateRefundMutation, usePaymentByOrderCode } from '@project-lc/hooks';
import {
  AdminReturnData,
  CreateRefundDto,
  CreateRefundRes,
  RefundAccountDto,
  ReturnItemWithOriginOrderItemInfo,
} from '@project-lc/shared-types';
import { getAdminHost } from '@project-lc/utils';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';

interface AdminRefundCreateFormData extends RefundAccountDto {
  refundAmount: number;
}

export interface AdminReturnRequestDetailProps {
  data?: AdminReturnData | null;
  /** '환불처리하기' 버튼 눌렀을때 실행할 콜백함수 */
  onSubmit?: () => void;
  /** '취소' 버튼 눌렀을때 실행할 콜백함수 */
  onCancel?: () => void;
}
export function AdminReturnRequestDetail({
  data,
  onSubmit,
  onCancel,
}: AdminReturnRequestDetailProps): JSX.Element {
  const { data: paymentData } = usePaymentByOrderCode(data?.order.orderCode || '');
  const toast = useToast();
  const defaultTotalRefundAmount = data?.items
    ? data?.items.reduce((sum: number, i) => {
        return (
          sum +
          Number(i?.orderItemOption?.quantity) * Number(i?.orderItemOption?.discountPrice)
        );
      }, 0)
    : 0;
  const methods = useForm<AdminRefundCreateFormData>({
    defaultValues: {
      refundAmount: defaultTotalRefundAmount,
      refundBank: data?.refundBank || undefined,
      refundAccount: data?.refundAccount || undefined,
      refundAccountHolder: data?.refundAccountHolder || undefined,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const handleSuccess = (res: CreateRefundRes): void => {
    console.log('success', res);
    toast({ status: 'success', title: '결제취소 성공' });
    if (onSubmit) onSubmit();
  };

  const handleError = (e: any): void => {
    toast({
      status: 'error',
      title: '결제취소 실패',
      description: e?.response?.data?.message,
    });
    console.log('error', e);
  };

  const { mutateAsync, isLoading } = useCreateRefundMutation();
  const submitHandler = (formData: AdminRefundCreateFormData): void => {
    if (!data) return;

    // 결제수단이 가상계좌인 경우 환불받을 은행, 계좌, 예금주 정보를 함께 전송해야함
    const virtualAccountRefundInfo =
      data?.order?.payment?.method === 'virtualAccount'
        ? {
            refundAccount: formData.refundAccount || undefined,
            refundBank: formData.refundBank || undefined,
            refundAccountHolder: formData.refundAccountHolder || undefined,
          }
        : undefined;

    const dto: CreateRefundDto = {
      orderId: data.order.id,
      reason: '소비자 환불 요청',
      items: data.items.map((i: ReturnItemWithOriginOrderItemInfo) => {
        const { orderItemId, orderItemOptionId, amount } = i;
        return { orderItemId, orderItemOptionId, amount };
      }),
      returnId: data.id, // 연결된 반품(환불)요청
      refundAmount: formData.refundAmount, // 환불금액
      paymentKey: data.order.payment?.paymentKey, // 환불요청을 진행하는 단계에서는 이미 결제가 완료된 상태이므로 결제키가 존재한다
      ...virtualAccountRefundInfo, // 가상계좌 환불수단 정보
    };

    mutateAsync(dto).then(handleSuccess).catch(handleError);
  };

  if (!data) return <Spinner />;

  return (
    <FormProvider {...methods}>
      <Stack as="form" onSubmit={handleSubmit(submitHandler)}>
        <Text>
          주문코드
          <NextLink passHref href={`${getAdminHost()}/order/list/${data.order.id}`}>
            <Link color="blue.500"> {data.order.orderCode}</Link>
          </NextLink>
        </Text>
        <Text>환불(반품)요청코드 {data.returnCode}</Text>

        <Box>
          <Text>주문 결제정보</Text>
          <Grid templateColumns="repeat(2, 5fr)" minWidth="300px" border="1px" p={1}>
            <GridItem>
              <Text>주문 총 결제금액</Text>
            </GridItem>
            <GridItem>
              <Text>
                {data.order.paymentPrice && data.order.paymentPrice.toLocaleString()} 원
              </Text>
            </GridItem>
            <GridItem>
              <Text>결제키</Text>
            </GridItem>
            <GridItem>
              <Text>{data.order.payment?.paymentKey}</Text>
            </GridItem>
            {paymentData && (
              <>
                <GridItem>
                  <Text>결제수단</Text>
                </GridItem>
                <GridItem>
                  <Text>{paymentData.method}</Text>
                </GridItem>
                {paymentData.method === '카드' && (
                  <CardDetail paymentData={paymentData} />
                )}
                {paymentData.method === '가상계좌' && (
                  <VirtualAccountDetail paymentData={paymentData} />
                )}
                {paymentData.method === '계좌이체' && (
                  <TransferDetail paymentData={paymentData} />
                )}
                <GridItem>
                  <Text>요청일시</Text>
                </GridItem>
                <GridItem>
                  <Text>
                    {dayjs(paymentData?.requestedAt).format('YYYY-MM-DD HH:mm:ss')}
                  </Text>
                </GridItem>
              </>
            )}
          </Grid>
        </Box>

        <Box>
          <Text>마일리지, 쿠폰 사용 내역</Text>
          <Stack border="1px" spacing={2}>
            <Table>
              <Thead>
                <Tr>
                  <Th>마일리지 사용 내역</Th>
                  <Th>마일리지 사용량</Th>
                </Tr>
              </Thead>

              <Tbody>
                {data.order.mileageLogs
                  .filter((log) => log.actionType === 'consume')
                  .map((i) => {
                    return (
                      <Tr key={i.id}>
                        <Td>{i?.reason}</Td>
                        <Td>{i?.amount}</Td>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
            <Table>
              <Thead>
                <Tr>
                  <Th>사용 쿠폰명</Th>
                  <Th>사용 쿠폰 할인액/할인율</Th>
                </Tr>
              </Thead>

              <Tbody>
                {data.order.customerCouponLogs
                  .filter((log) => log.type === 'use')
                  .map((i) => {
                    return (
                      <Tr key={i.id}>
                        <Td>{i?.customerCoupon?.coupon?.name}</Td>
                        <Td>
                          {i?.customerCoupon?.coupon?.amount}{' '}
                          {i?.customerCoupon?.coupon?.unit === 'W' ? '원' : '%'}
                        </Td>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          </Stack>
        </Box>

        <Table>
          <Thead>
            <Tr>
              <Th>환불신청상품</Th>
              <Th>가격</Th>
              <Th>수량</Th>
              <Th>합계</Th>
            </Tr>
          </Thead>

          <Tbody>
            {data?.items.map((i) => {
              return (
                <Tr key={i.id}>
                  <Td>
                    {i?.orderItemOption?.goodsName}, {i?.orderItemOption?.name} :{' '}
                    {i?.orderItemOption?.value}
                  </Td>
                  <Td>{i?.orderItemOption?.discountPrice}</Td>
                  <Td>{i?.orderItemOption?.quantity}</Td>
                  <Td>
                    {Number(i?.orderItemOption?.quantity) *
                      Number(i?.orderItemOption?.discountPrice)}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th colSpan={2}>환불할 금액을 입력해주세요</Th>
              <Th>총 환불금액</Th>
              <Th>
                <FormControl isInvalid={!!errors.refundAmount}>
                  <Input
                    type="number"
                    {...register('refundAmount', {
                      valueAsNumber: true,
                      required: '총 환불금액을 입력해주세요',
                      max: {
                        value: defaultTotalRefundAmount,
                        message: '총 환불금액이 환불신청상품 금액의 총 합계보다 큽니다',
                      },
                    })}
                    defaultValue={defaultTotalRefundAmount}
                  />

                  <FormErrorMessage>
                    {errors.refundAmount && errors.refundAmount.message}
                  </FormErrorMessage>
                </FormControl>
              </Th>
            </Tr>
          </Tfoot>
        </Table>

        <Stack spacing={4} direction="row-reverse">
          <Button type="submit" colorScheme="red" isLoading={isLoading}>
            환불처리하기
          </Button>
          <Button onClick={onCancel}>취소</Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
}

export default AdminReturnRequestDetail;
