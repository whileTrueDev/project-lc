import { Alert, AlertIcon, AlertDescription, Button } from '@chakra-ui/react';

type AlertTypeKey = 'return' | 'exchange' | 'cancel';

const temp: Record<
  AlertTypeKey,
  { text: string; status: 'error' | 'warning' | 'info' | 'success' }
> = {
  return: { text: '반품(환불)', status: 'error' },
  exchange: { text: '교환(재배송)', status: 'warning' },
  cancel: { text: '주문취소', status: 'error' },
};

export interface OrderExchangeReturnCancelExistsAlertProps {
  targetSectionTitle: string;
  alertTypeKey: AlertTypeKey;
}
export function OrderExchangeReturnCancelExistsAlert({
  targetSectionTitle = '환불 정보',
  alertTypeKey,
}: OrderExchangeReturnCancelExistsAlertProps): JSX.Element {
  const { text, status } = temp[alertTypeKey];
  return (
    <Alert status={status}>
      <AlertIcon />
      <AlertDescription>
        이 주문에는 {text} 요청이 있습니다! 아래{' '}
        <Button
          variant="link"
          textDecoration="underline"
          colorScheme="messenger"
          onClick={() => {
            document.getElementById(targetSectionTitle)?.scrollIntoView();
          }}
        >
          {text} 정보
        </Button>{' '}
        에서 {text} 요청을 확인해주세요.
      </AlertDescription>
    </Alert>
  );
}

export default OrderExchangeReturnCancelExistsAlert;
