import { Spinner, Stack, Text, Link, Grid, GridItem } from '@chakra-ui/react';
import { usePaymentByOrderCode } from '@project-lc/hooks';
import { AdminRefundData, TossPaymentCancel } from '@project-lc/shared-types';
import { getAdminHost } from '@project-lc/utils';
import dayjs from 'dayjs';
import NextLink from 'next/link';

export interface AdminOrderRefundDetailProps {
  refundData: AdminRefundData | null;
}
export function AdminOrderRefundDetail({
  refundData,
}: AdminOrderRefundDetailProps): JSX.Element {
  const { data: paymentData } = usePaymentByOrderCode(refundData?.order.orderCode || '');

  if (!refundData) return <Spinner />;

  return (
    <Stack>
      <Text>
        주문코드
        <NextLink passHref href={`${getAdminHost()}/order/list/${refundData.order.id}`}>
          <Link color="blue.500"> {refundData.order.orderCode}</Link>
        </NextLink>
      </Text>

      <Grid templateColumns="repeat(2, 1fr)" border="1px" p={1}>
        <GridItem>
          <Text>환불 은행</Text>
        </GridItem>
        <GridItem>
          <Text>{refundData.refundBank}</Text>
        </GridItem>

        <GridItem>
          <Text>환불 계좌</Text>
        </GridItem>
        <GridItem>
          <Text>{refundData.refundAccount}</Text>
        </GridItem>

        <GridItem>
          <Text>환불 계좌 예금주</Text>
        </GridItem>
        <GridItem>
          <Text>{refundData.refundAccountHolder}</Text>
        </GridItem>

        <GridItem>
          <Text>환불 금액</Text>
        </GridItem>
        <GridItem>
          <Text>{refundData.refundAmount}</Text>
        </GridItem>
      </Grid>

      <Text>토스 결제취소 내역</Text>
      {paymentData?.cancels?.map((cancel) => {
        return <CancelDataBox key={cancel.transactionKey} data={cancel} />;
      })}
    </Stack>
  );
}

export default AdminOrderRefundDetail;

export function CancelDataBox({ data }: { data: TossPaymentCancel }): JSX.Element {
  return (
    <Grid templateColumns="repeat(2, 5fr)" minWidth="300px" border="1px" p={1}>
      <GridItem>
        <Text>환불한 금액</Text>
      </GridItem>
      <GridItem>
        <Text>{data.cancelAmount} 원</Text>
      </GridItem>

      <GridItem>
        <Text>환불 이유</Text>
      </GridItem>
      <GridItem>
        <Text>{data.cancelReason}</Text>
      </GridItem>

      <GridItem>
        <Text>환불 일시</Text>
      </GridItem>
      <GridItem>
        <Text>{dayjs(data.canceledAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
      </GridItem>

      <GridItem>
        <Text>결제취소키(토스 결제 취소 건에 대한 고유키)</Text>
      </GridItem>
      <GridItem>
        <Text>{data.transactionKey}</Text>
      </GridItem>
    </Grid>
  );
}
