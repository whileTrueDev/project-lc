import { Alert, AlertIcon, AlertDescription, Button } from '@chakra-ui/react';

export interface OrderRefundExistsAlertProps {
  targetSectionTitle: string;
}
export function OrderRefundExistsAlert({
  targetSectionTitle = '환불 정보',
}: OrderRefundExistsAlertProps): JSX.Element {
  return (
    <Alert status="warning">
      <AlertIcon />
      <AlertDescription>
        이 주문에는 환불 요청이 있습니다! 아래{' '}
        <Button
          variant="link"
          textDecoration="underline"
          colorScheme="messenger"
          onClick={() => {
            document.getElementById(targetSectionTitle)?.scrollIntoView();
          }}
        >
          환불 정보
        </Button>{' '}
        에서 환불 요청을 확인해주세요.
      </AlertDescription>
    </Alert>
  );
}

export default OrderRefundExistsAlert;
