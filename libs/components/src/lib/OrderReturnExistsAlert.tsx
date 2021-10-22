import { Alert, AlertIcon, AlertDescription, Button, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';

export interface OrderReturnExistsAlertProps {
  targetSectionTitle: string;
}
export function OrderReturnExistsAlert({
  targetSectionTitle = '반품 정보',
}: OrderReturnExistsAlertProps): JSX.Element {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertDescription>
        이 주문에는 반품 요청이 있습니다! 아래{' '}
        <Button
          variant="link"
          textDecoration="underline"
          colorScheme="messenger"
          onClick={() => {
            document.getElementById(targetSectionTitle)?.scrollIntoView();
          }}
        >
          반품 정보
        </Button>{' '}
        에서 반품 요청을 확인해주세요.
      </AlertDescription>
    </Alert>
  );
}

export default OrderReturnExistsAlert;

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
