import {
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Table,
  Stack,
  Text,
  Box,
  Grid,
  GridItem,
  Tfoot,
  Input,
  Divider,
  Button,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { CardDetail } from '@project-lc/components-shared/payment/CardDetail';
import { TransferDetail } from '@project-lc/components-shared/payment/TransferDetail';
import { VirtualAccountDetail } from '@project-lc/components-shared/payment/VirtualAccountDetail';
import { useCreateRefundMutation, usePaymentByOrderCode } from '@project-lc/hooks';
import { CreateRefundDto } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';

type AdminRefundCreateFormData = {
  refundAmount: number;
};

export interface AdminReturnRequestDetailProps {
  data?: any;
}
export function AdminReturnRequestDetail({
  data,
}: AdminReturnRequestDetailProps): JSX.Element {
  const { data: paymentData } = usePaymentByOrderCode(data?.order?.orderCode);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminRefundCreateFormData>();

  const handleSuccess = (res: any): void => {
    console.log('success', res);
  };

  const handleError = (e: any): void => {
    console.log('error', e);
  };

  const { mutateAsync } = useCreateRefundMutation();
  const submitHandler = (formData: AdminRefundCreateFormData): void => {
    console.log(formData);

    const dto: CreateRefundDto = {
      orderId: data?.order?.id,
      reason: '소비자 환불 요청',
      items: data?.items.map((i: any) => {
        const { orderItemId, orderItemOptionId, amount } = i;
        return { orderItemId, orderItemOptionId, amount };
      }),
      returnId: data?.id, // 연결된 반품(환불)요청
      refundAmount: formData.refundAmount, // 환불금액
      // 가상계좌로 결제했을 경우 - 환불요청시 소비자가 입력한 계좌
      refundAccount:
        data?.order?.payment?.method === 'virtualAccount'
          ? data?.returnBankAccount
          : undefined,
      // 가상계좌로 결제했을 경우 - 환불요청시 소비자가 입력한 은행
      refundBank:
        data?.order?.payment?.methods === 'virtualAccount' ? data?.returnBank : undefined,
      // 환불요청을 진행하는 단계에서는 이미 결제가 완료된 상태이므로 결제키가 존재한다
      paymentKey: data?.order?.payment?.paymentKey,
    };

    mutateAsync(dto).then(handleSuccess).catch(handleError);
  };

  const defaultTotalRefundAmount = data?.items
    ? data?.items.reduce((sum: number, i: any) => {
        return (
          sum +
          Number(i?.orderItemOption?.quantity) * Number(i?.orderItemOption?.discountPrice)
        );
      }, 0)
    : 0;

  // 토스페이먼츠 결제취소요청 후 refund 데이터 생성
  return (
    <Stack as="form" onSubmit={handleSubmit(submitHandler)}>
      <Text>주문코드 {data?.order?.orderCode}</Text>
      <Text>환불(반품)요청코드 {data?.returnCode}</Text>

      <Box>
        <Text>주문 결제정보</Text>
        <Grid templateColumns="repeat(2, 5fr)" minWidth="300px" border="1px" p={1}>
          <GridItem>
            <Text>주문 총 결제금액</Text>
          </GridItem>
          <GridItem>
            <Text>
              {data?.order?.paymentPrice && data?.order?.paymentPrice.toLocaleString()} 원
            </Text>
          </GridItem>
          <GridItem>
            <Text>결제키</Text>
          </GridItem>
          <GridItem>
            <Text>{data?.order?.payment?.paymentKey}</Text>
          </GridItem>
          <GridItem>
            <Text>결제수단</Text>
          </GridItem>
          <GridItem>
            <Text>{paymentData?.method}</Text>
          </GridItem>
          {paymentData?.method === '카드' && <CardDetail paymentData={paymentData} />}
          {paymentData?.method === '가상계좌' && (
            <VirtualAccountDetail paymentData={paymentData} />
          )}
          {paymentData?.method === '계좌이체' && (
            <TransferDetail paymentData={paymentData} />
          )}
          <GridItem>
            <Text>요청일시</Text>
          </GridItem>
          <GridItem>
            <Text>{dayjs(paymentData?.requestedAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
          </GridItem>
        </Grid>
      </Box>

      <Box>
        <Text>환불요청정보</Text>
        {/* // TODO : 환불요청시 결제수단에 따라 환불요청 입력 optional 혹은 안보이게 처리 */}
        <Grid templateColumns="repeat(2, 1fr)" border="1px" p={1}>
          <GridItem>
            <Text>환불 은행</Text>
          </GridItem>
          <GridItem>
            <Text>{data?.returnBank}</Text>
          </GridItem>

          <GridItem>
            <Text>환불 계좌</Text>
          </GridItem>
          <GridItem>
            <Text>{data?.returnBankAccount}</Text>
          </GridItem>
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
              {data?.order?.mileageLogs
                .filter((log: any) => log.actionType === 'consume')
                .map((i: any) => {
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
              {data?.order?.customerCouponLogs
                .filter((log: any) => log.type === 'use')
                .map((i: any) => {
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
          {data?.items.map((i: any) => {
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
        <Button type="submit" colorScheme="red">
          환불처리하기
        </Button>
        <Button>취소</Button>
      </Stack>
    </Stack>
  );
}

export default AdminReturnRequestDetail;
