import { Button, Center, Image, Spinner, Stack, Text, useToast } from '@chakra-ui/react';
import { ExchangeReturnCancelRequestGoodsData } from '@project-lc/components-shared/order/ExchangeReturnCancelRequestGoodsData';
import { ExchangeReturnCancelRequestStatusBadge } from '@project-lc/components-shared/order/ExchangeReturnCancelRequestStatusBadge';
import { useDeleteCustomerReturn, useReturnDetail } from '@project-lc/hooks';
import { ReturnDetailRes } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import RelatedRefundData from './RelatedRefundData';

export interface CustomerReturnDetailProps {
  returnCode: string;
}

/** 재배송/환불 중 환불(=수거없는 "반품") 상세 */
export function CustomerReturnDetail({
  returnCode,
}: CustomerReturnDetailProps): JSX.Element {
  const { data, isLoading } = useReturnDetail(returnCode);
  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }
  if (!data) {
    return <Text>해당 환불신청 내역이 존재하지 않습니다 환불신청코드: {returnCode}</Text>;
  }
  return <ReturnDetailData data={data} />;
}

export default CustomerReturnDetail;

export function ReturnDetailData({ data }: { data: ReturnDetailRes }): JSX.Element {
  const router = useRouter();
  const toast = useToast();

  const requestDate = dayjs(data.requestDate).format('YYYY-MM-DD');
  const completeDate = data.completeDate
    ? dayjs(data.completeDate).format('YYYY-MM-DD')
    : '';

  const { mutateAsync, isLoading } = useDeleteCustomerReturn();
  const handleDeleteRequest = (): void => {
    mutateAsync(data.id)
      .then((res) => {
        console.log(res);
        toast({ title: '환불요청을 철회하였습니다', status: 'success' });
        router.push('/mypage/exchange-return-cancel');
      })
      .catch((e) => {
        toast({
          title: '환불요청 철회 중 오류가 발생하였습니다',
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
          <Text fontWeight="bold">환불요청코드</Text>
          <Text pl={4}>{data.returnCode}</Text>
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
        <Text fontWeight="bold">환불요청 처리상태</Text>

        <Stack pl={4}>
          <Stack direction="row" alignItems="center">
            <ExchangeReturnCancelRequestStatusBadge status={data.status} />
            {/* 환불요청요청이 신청됨 상태일때만 철회가능하도록 */}
            {data.status === 'requested' && (
              <Button size="xs" onClick={handleDeleteRequest} isLoading={isLoading}>
                철회하기
              </Button>
            )}
          </Stack>
          {data.rejectReason && (
            <Text pl={4}>환불요청 거절 사유 : {data.rejectReason}</Text>
          )}

          <Text>요청일 : {requestDate}</Text>
          <Stack pl={4}>
            <Text>환불요청 사유 : {data.reason}</Text>
            {data.images.length && (
              <>
                <Text>환불요청 이미지 : </Text>
                {data.images.map((img) => (
                  <Image maxW="400px" maxH="300px" src={img.imageUrl} key={img.id} />
                ))}
              </>
            )}
          </Stack>

          {completeDate && <Text>완료일 : {completeDate}</Text>}
        </Stack>
      </Stack>

      <Stack>
        <Text fontWeight="bold">환불요청한 주문상품</Text>
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
