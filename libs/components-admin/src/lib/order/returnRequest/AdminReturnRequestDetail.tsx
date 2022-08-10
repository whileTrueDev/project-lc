import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Grid,
  GridItem,
  Image,
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
  useBoolean,
  useToast,
} from '@chakra-ui/react';
import { CustomerMileageLog } from '@prisma/client';
import { CardDetail } from '@project-lc/components-shared/payment/CardDetail';
import { RefundAccountForm } from '@project-lc/components-shared/payment/RefundAccountForm';
import { TransferDetail } from '@project-lc/components-shared/payment/TransferDetail';
import { VirtualAccountDetail } from '@project-lc/components-shared/payment/VirtualAccountDetail';
import {
  ReturnMutationDto,
  useCreateRefundMutation,
  usePaymentByOrderCode,
  useUpdateReturnMutation,
} from '@project-lc/hooks';
import {
  AdminReturnData,
  CreateRefundDto,
  CustomerCouponLogWithCouponInfo,
  OrderWithPaymentData,
  Payment,
  RefundAccountDto,
  ReturnItemWithOriginOrderItemInfo,
  TossPaymentCancel,
} from '@project-lc/shared-types';
import { getAdminHost } from '@project-lc/utils';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';
import { UpdateReturnRequestStatusSection } from './UpdateReturnRequestStatusSection';

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
  const [isImageOpen, { toggle }] = useBoolean();
  const defaultTotalRefundAmount = data?.items
    ? data?.items.reduce((sum: number, i) => {
        return (
          sum +
          Number(i?.orderItemOption?.quantity) * Number(i?.orderItemOption?.discountPrice)
        );
      }, 0)
    : 0;

  // 환불생성(환불처리) 폼
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

  const handleSuccess = (res: any): void => {
    console.log('success', res);
    toast({ status: 'success', title: '결제취소 성공' });
    if (onSubmit) onSubmit();
  };

  const handleError = (e: any): void => {
    toast({
      status: 'error',
      title: '결제취소 중 오류가 발생했습니다',
      description: e?.response?.data?.message || e?.message,
    });
    console.log('error', e);
  };

  const createRefund = useCreateRefundMutation();
  const updateReturnStatus = useUpdateReturnMutation();
  const submitHandler = async (formData: AdminRefundCreateFormData): Promise<void> => {
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

    const createRefundDto: CreateRefundDto = {
      orderId: data.order.id,
      reason: '소비자 환불 요청',
      items: data.items.map((i: ReturnItemWithOriginOrderItemInfo) => {
        const { orderItemId, orderItemOptionId, quantity } = i;
        return { orderItemId, orderItemOptionId, quantity };
      }),
      returnId: data.id, // 연결된 반품(환불)요청
      refundAmount: formData.refundAmount, // 환불금액
      paymentKey: data.order.payment?.paymentKey, // 환불요청을 진행하는 단계에서는 이미 결제가 완료된 상태이므로 결제키가 존재한다
      ...virtualAccountRefundInfo, // 가상계좌 환불수단 정보
    };

    try {
      // 환불처리 진행
      const refundData = await createRefund.mutateAsync(createRefundDto);

      // 반품요청(환불요청) 상태 업데이트
      const returnStatusUpdateDto: ReturnMutationDto = {
        returnId: data.id,
        dto: {
          status: 'complete',
          refundId: refundData?.id, // 환불정보와 연결
        },
      };
      const res = await updateReturnStatus.mutateAsync(returnStatusUpdateDto);
      handleSuccess(res);
    } catch (e) {
      handleError(e);
    }
  };

  if (!data) return <Spinner />;

  return (
    <Stack>
      <Text>
        주문코드
        <NextLink passHref href={`${getAdminHost()}/order/list/${data.order.id}`}>
          <Link color="blue.500"> {data.order.orderCode}</Link>
        </NextLink>
      </Text>
      <Text>환불(반품)요청코드 {data.returnCode}</Text>
      <Stack direction="row">
        <Text>소비자의 환불 요청 사유 : {data.reason}</Text>
        {data.images.length > 0 && (
          <Button size="xs" onClick={toggle}>
            사진 {isImageOpen ? '숨기기' : '확인하기'}
          </Button>
        )}
      </Stack>
      {isImageOpen && (
        <Box>
          {data.images.map((img) => (
            <Image key={img.imageUrl} src={img.imageUrl} />
          ))}
        </Box>
      )}
      {data.rejectReason && <Text>환불 요청 거절 사유 : {data.rejectReason}</Text>}
      {data.memo && <Text>메모 : {data.memo}</Text>}
      {/* successHandler로 onCancel(다이얼로그 닫기) 전달 */}
      <UpdateReturnRequestStatusSection data={data} successHandler={onCancel} />

      {/* 주문 결제정보 표시 */}
      <OrderPaymentDataDisplay order={data.order} payment={paymentData} />

      {/* 마일리지, 쿠폰 사용내역 있는 경우에만 표시 */}
      {data.order.mileageLogs.length > 0 ||
        (data.order.customerCouponLogs.length > 0 && (
          <Box>
            <Text>마일리지, 쿠폰 사용 내역</Text>
            <Stack border="1px" spacing={2}>
              {data.order.mileageLogs.length > 0 && (
                <MileageUsageTable mileageLogs={data.order.mileageLogs} />
              )}
              {data.order.customerCouponLogs.length > 0 && (
                <CouponUsageTable couponLogs={data.order.customerCouponLogs} />
              )}
            </Stack>
          </Box>
        ))}

      <FormProvider {...methods}>
        <Stack as="form" onSubmit={handleSubmit(submitHandler)}>
          <RefundRequestItemsDisplayTable
            returnItems={data?.items || []}
            tableFooter={
              // 환불처리내역이 없고, 상태가 '처리중'인 경우에만 환불금액 입력창 노출
              !data.refund && data.status === 'processing' ? (
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
                              message:
                                '총 환불금액이 환불신청상품 금액의 총 합계보다 큽니다',
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
              ) : undefined
            }
          />

          {paymentData && paymentData.method === '가상계좌' && <RefundAccountForm />}

          {data.refund && paymentData?.cancels && (
            <CancelDataDisplayTable cancels={paymentData?.cancels} />
          )}

          <Stack spacing={4} direction="row-reverse">
            {/* 환불처리내역이 없고, 상태가 '처리중'인 경우에만 환불처리 버튼 노출 */}
            {!data.refund && data.status === 'processing' && (
              <Button
                type="submit"
                colorScheme="red"
                isLoading={createRefund.isLoading || updateReturnStatus.isLoading}
              >
                환불처리하기
              </Button>
            )}

            <Button onClick={onCancel}>닫기</Button>
          </Stack>
        </Stack>
      </FormProvider>
    </Stack>
  );
}

export default AdminReturnRequestDetail;

/** 환불신청상품들 표시 테이블, tableFooter 에는 <Tfoot> 컴포넌트로 환불금액 입력하는 컴포넌트를 넣는다 */
function RefundRequestItemsDisplayTable({
  returnItems,
  tableFooter,
}: {
  returnItems: ReturnItemWithOriginOrderItemInfo[];
  tableFooter?: JSX.Element;
}): JSX.Element {
  return (
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
        {returnItems.map((i) => {
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
      {tableFooter}
    </Table>
  );
}

/** 토스페이먼츠 결제수단, 결제정보 표시 */
function PaymentDataDisplay({ paymentData }: { paymentData: Payment }): JSX.Element {
  return (
    <>
      <GridItem>
        <Text>결제수단</Text>
      </GridItem>
      <GridItem>
        <Text>{paymentData.method}</Text>
      </GridItem>
      {paymentData.method === '카드' && <CardDetail paymentData={paymentData} />}
      {paymentData.method === '가상계좌' && (
        <VirtualAccountDetail paymentData={paymentData} />
      )}
      {paymentData.method === '계좌이체' && <TransferDetail paymentData={paymentData} />}
      <GridItem>
        <Text>요청일시</Text>
      </GridItem>
      <GridItem>
        <Text>{dayjs(paymentData?.requestedAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
      </GridItem>
    </>
  );
}

/** 주문 결제정보 표시 */
function OrderPaymentDataDisplay({
  order,
  payment,
}: {
  order: OrderWithPaymentData;
  payment?: Payment;
}): JSX.Element {
  return (
    <Box>
      <Text>주문 결제정보</Text>
      <Grid templateColumns="repeat(2, 5fr)" minWidth="300px" border="1px" p={1}>
        <GridItem>
          <Text>주문 총 결제금액</Text>
        </GridItem>
        <GridItem>
          <Text>{order.paymentPrice && order.paymentPrice.toLocaleString()} 원</Text>
        </GridItem>
        <GridItem>
          <Text>결제키</Text>
        </GridItem>
        <GridItem>
          <Text>{order.payment?.paymentKey}</Text>
        </GridItem>
        {payment && <PaymentDataDisplay paymentData={payment} />}
      </Grid>
    </Box>
  );
}

/** 마일리지 사용내역 표시 테이블 */
function MileageUsageTable({
  mileageLogs,
}: {
  mileageLogs: CustomerMileageLog[];
}): JSX.Element {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>마일리지 사용 내역</Th>
          <Th>마일리지 사용량</Th>
        </Tr>
      </Thead>

      <Tbody>
        {mileageLogs
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
  );
}

/** 쿠폰사용내역 표시 테이블 */
function CouponUsageTable({
  couponLogs,
}: {
  couponLogs: CustomerCouponLogWithCouponInfo[];
}): JSX.Element {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>사용 쿠폰명</Th>
          <Th>사용 쿠폰 할인액/할인율</Th>
        </Tr>
      </Thead>

      <Tbody>
        {couponLogs
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
  );
}

/** 환불처리완료 정보 표시 테이블 */
export function CancelDataDisplayTable({
  cancels,
}: {
  cancels: TossPaymentCancel[];
}): JSX.Element {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>환불 이유</Th>
          <Th>환불완료 일시</Th>
          <Th>결제취소키(토스 결제 취소 건에 대한 고유키)</Th>
          <Th>환불한 금액</Th>
        </Tr>
      </Thead>

      <Tbody>
        {cancels.map((cancel) => (
          <Tr key={cancel.transactionKey}>
            <Td>{cancel.cancelReason}</Td>
            <Td>{dayjs(cancel.canceledAt).format('YYYY-MM-DD HH:mm:ss')}</Td>
            <Td>{cancel.transactionKey}</Td>
            <Td>{getLocaleNumber(cancel.cancelAmount)} 원</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
