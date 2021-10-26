import { Alert, AlertIcon, AlertDescription } from '@chakra-ui/react';
import dayjs from 'dayjs';

/** 결제취소요청 데이터가 있는 경우 알림문구 */

export function OrderCancelRequestExistAlert({
  data,
}: {
  data: { createDate: Date; reason: string };
}): JSX.Element {
  const { createDate, reason } = data;
  const requestDate = dayjs(createDate).format('YYYY/MM/DD HH:mm');
  return (
    <Alert status="info">
      <AlertIcon />
      <AlertDescription>
        이 주문에 대해 결제취소를 요청 했습니다. (요청 일시 : {requestDate}) (요청 사유 :{' '}
        {reason})
      </AlertDescription>
    </Alert>
  );
}
