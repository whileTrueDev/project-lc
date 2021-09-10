import { Alert, AlertIcon, AlertDescription, Button } from '@chakra-ui/react';

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
