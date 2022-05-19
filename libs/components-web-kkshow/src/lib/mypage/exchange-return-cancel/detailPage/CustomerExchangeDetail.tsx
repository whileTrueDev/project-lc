import { Button, Center, Image, Spinner, Stack, Text, useToast } from '@chakra-ui/react';
import { Export, ExportProcessStatus } from '@prisma/client';
import { useDeleteCustomerExchange, useExchangeDetail } from '@project-lc/hooks';
import { ExchangeDetailRes } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import {
  ExchangeReturnCancelRequestGoodsData,
  ExchangeReturnCancelRequestStatusBadge,
} from '../list/ExchangeReturnCancelListItem';

export interface CustomerExchangeDetailProps {
  exchangeCode: string;
}
export function CustomerExchangeDetail({
  exchangeCode,
}: CustomerExchangeDetailProps): JSX.Element {
  const { data, isLoading } = useExchangeDetail(exchangeCode);
  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }
  if (!data) {
    return (
      <Text>해당 재배송요청 내역이 존재하지 않습니다 재배송요청코드: {exchangeCode}</Text>
    );
  }
  return (
    <Stack>
      <ExchangeDetialData data={data} />
    </Stack>
  );
}

export default CustomerExchangeDetail;

export function ExchangeDetialData({ data }: { data: ExchangeDetailRes }): JSX.Element {
  const router = useRouter();
  const toast = useToast();

  const requestDate = dayjs(data.requestDate).format('YYYY-MM-DD');
  const completeDate = data.completeDate
    ? dayjs(data.completeDate).format('YYYY-MM-DD')
    : '';

  const { mutateAsync } = useDeleteCustomerExchange();
  const handleDeleteRequest = (): void => {
    mutateAsync(data.id)
      .then((res) => {
        console.log(res);
        toast({ title: '재배송 요청을 철회하였습니다', status: 'success' });
        router.push('/mypage/exchange-return-cancel');
      })
      .catch((e) => {
        toast({
          title: '재배송 요청 철회 중 오류가 발생하였습니다',
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
          <Text fontWeight="bold">재배송요청코드</Text>
          <Text pl={4}>{data.exchangeCode}</Text>
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
        <Text fontWeight="bold">재배송요청 처리상태</Text>

        <Stack pl={4}>
          <Stack direction="row" alignItems="center">
            <ExchangeReturnCancelRequestStatusBadge status={data.status} />
            {/* 재배송요청요청이 신청됨 상태일때만 철회가능하도록 */}
            {data.status === 'requested' && (
              <Button size="xs" onClick={handleDeleteRequest}>
                철회하기
              </Button>
            )}
          </Stack>
          {data.rejectReason && (
            <Text pl={4}>재배송요청 거절 사유 : {data.rejectReason}</Text>
          )}

          <Text>요청일 : {requestDate}</Text>
          <Stack pl={4}>
            <Text>재배송요청 사유 : {data.reason}</Text>
            {data.images.length && (
              <>
                <Text>재배송요청 이미지 : </Text>
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
        <Text fontWeight="bold">취소요청한 주문상품</Text>
        <Stack pl={4}>
          {data.items.map((item) => (
            <ExchangeReturnCancelRequestGoodsData key={item.id} {...item} />
          ))}
        </Stack>
      </Stack>

      {/* 재출고정보 */}
      <ReExportData exportData={data.export} />
    </Stack>
  );
}

const EXPORT_PROCESS_STATUS: Record<ExportProcessStatus, string> = {
  preparing: '출고준비중',
  exportDone: '출고완료',
  shipping: '배송중',
  shippingDone: '배송완료',
};

export interface ReExportDataProps {
  exportData: Export | null; // export가 예약어라 변수명으로 쓸 수 없음
}
/** 교환 요청에 연결된 재배송 정보 표시
 // TODO: 임의로 출고상태, 출고일, 운송장번호, 택배사만 표시함. 기획 요청에 따라 필요한 데이터 추가 & 디자인 적용필요
 */
export function ReExportData(props: ReExportDataProps): JSX.Element {
  const { exportData } = props;
  return (
    <Stack>
      <Text fontWeight="bold">재배송 안내</Text>
      <Stack pl={4}>
        {exportData ? (
          <Stack>
            <Text>상태 : {EXPORT_PROCESS_STATUS[exportData.status]}</Text>
            <Text>
              출고일 :{' '}
              {exportData.exportDate &&
                dayjs(exportData.exportDate).format('YYYY-MM-DD HH:mm')}
            </Text>
            <Text>운송장번호 : {exportData.deliveryNumber}</Text>
            <Text>택배사 : {exportData.deliveryCompany}</Text>
          </Stack>
        ) : (
          <Stack>
            <Text>재배송 출고 정보가 없습니다.</Text>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}