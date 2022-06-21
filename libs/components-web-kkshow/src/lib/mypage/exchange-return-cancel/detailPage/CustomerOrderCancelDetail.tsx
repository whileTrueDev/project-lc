import { Button, Center, Spinner, Stack, Text } from '@chakra-ui/react';
import { ExchangeReturnCancelRequestGoodsData } from '@project-lc/components-shared/order/ExchangeReturnCancelRequestGoodsData';
import { ExchangeReturnCancelRequestStatusBadge } from '@project-lc/components-shared/order/ExchangeReturnCancelRequestStatusBadge';
import { RelatedRefundData } from '@project-lc/components-shared/order/RelatedRefundData';
import { useCustomerOrderCancellationDetail } from '@project-lc/hooks';
import { OrderCancellationData } from '@project-lc/shared-types';
import dayjs from 'dayjs';

export interface CustomerOrderCancelDetailProps {
  cancelCode: string;
}
export function CustomerOrderCancelDetail({
  cancelCode,
}: CustomerOrderCancelDetailProps): JSX.Element {
  const { data, isLoading } = useCustomerOrderCancellationDetail(cancelCode);
  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }
  if (!data) {
    return <Text>해당 주문취소 내역이 존재하지 않습니다 주문취소코드: {cancelCode}</Text>;
  }
  return (
    <Stack>
      <OrderCancelDetailData data={data} />
    </Stack>
  );
}

export default CustomerOrderCancelDetail;

export function OrderCancelDetailData({
  data,
}: {
  data: OrderCancellationData;
}): JSX.Element {
  const requestDate = dayjs(data.requestDate).format('YYYY-MM-DD');
  const completeDate = data.completeDate
    ? dayjs(data.completeDate).format('YYYY-MM-DD')
    : '';

  return (
    <Stack spacing={8} px={2}>
      <Stack direction="row" justifyContent="space-between">
        <Stack>
          <Text fontWeight="bold">주문취소코드</Text>
          <Text pl={4}>{data.cancelCode}</Text>
        </Stack>

        <Button
          size="xs"
          onClick={() => {
            console.log(`주문상세보기로 이동, 주문코드: ${data.order.orderCode}`);
          }}
        >
          주문상세보기
        </Button>
      </Stack>

      <Stack>
        <Text fontWeight="bold">주문취소 처리상태</Text>

        <Stack pl={4}>
          <Stack direction="row" alignItems="center">
            <ExchangeReturnCancelRequestStatusBadge status={data.status} />
          </Stack>

          <Text>요청일 : {requestDate}</Text>
          {completeDate && <Text>완료일 : {completeDate}</Text>}
        </Stack>
      </Stack>

      <Stack>
        <Text fontWeight="bold">취소요청한 주문상품</Text>
        <Stack pl={4}>
          {data.items.map((item) => (
            <ExchangeReturnCancelRequestGoodsData key={item.id} {...item} />
          ))}
        </Stack>
      </Stack>

      {/* 환불정보 */}
      <RelatedRefundData
        refund={data.refund}
        estimatedRefundAmount={data.items
          .map((item) => item.price)
          .reduce((sum, price) => sum + price, 0)}
      />
    </Stack>
  );
}
