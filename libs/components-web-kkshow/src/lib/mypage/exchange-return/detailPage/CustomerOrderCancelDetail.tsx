import { Button, Center, Spinner, Stack, Text, useToast } from '@chakra-ui/react';
import {
  useCustomerOrderCancellationDetail,
  useDeleteCustomerOrderCancel,
} from '@project-lc/hooks';
import { OrderCancellationData } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import {
  ExchangeReturnCancelRequestGoodsData,
  ExchangeReturnCancelRequestStatusBadge,
} from '../list/ExchangeReturnCancelListItem';
import RelatedRefundData from './RelatedRefundData';

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
  const router = useRouter();
  const toast = useToast();

  const requestDate = dayjs(data.requestDate).format('YYYY-MM-DD');
  const completeDate = data.completeDate
    ? dayjs(data.completeDate).format('YYYY-MM-DD')
    : '';

  const { mutateAsync } = useDeleteCustomerOrderCancel();
  const handleDeleteRequest = (): void => {
    mutateAsync(data.id)
      .then((res) => {
        console.log(res);
        toast({ title: '주문취소 요청을 철회하였습니다', status: 'success' });
        router.push('/mypage/exchange-return');
      })
      .catch((e) => {
        toast({
          title: '주문취소 요청 철회 중 오류가 발생하였습니다',
          description: e?.response?.data?.message || e,
          status: 'error',
        });
        console.log(e?.response?.data?.message, e);
      });
  };
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
            // TODO: 주문상세보기로 이동
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
            {/* 주문취소요청이 신청됨 상태일때만 철회가능하도록 */}
            {data.status === 'requested' && (
              <Button size="xs" onClick={handleDeleteRequest}>
                철회하기
              </Button>
            )}
          </Stack>
          {data.rejectReason && (
            <Text pl={4}>주문취소 거절 사유 : {data.rejectReason}</Text>
          )}

          <Text>요청일 : {requestDate}</Text>
          <Stack pl={4}>
            <Text>주문취소 사유 : {data.reason}</Text>
          </Stack>

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
          .reduce((sum, price) => sum + price)}
      />
    </Stack>
  );
}
