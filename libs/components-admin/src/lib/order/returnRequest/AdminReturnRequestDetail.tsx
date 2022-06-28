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
      refundAmount: formData.refundAmount,
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
            <Text>{data?.payment?.paymentKey}</Text>
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

      <Divider />

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
      <Stack border="1px">
        <Box>
          <Text>결제시 사용한 마일리지</Text>
          <Text> {JSON.stringify(data?.order?.mileageLogs)}</Text>
        </Box>
        <Box>
          <Text>결제시 사용한 쿠폰</Text>
          <Text> {JSON.stringify(data?.order?.mileageLogs)}</Text>
        </Box>
      </Stack>

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
