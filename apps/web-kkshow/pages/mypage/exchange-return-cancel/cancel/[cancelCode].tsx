import { Box } from '@chakra-ui/react';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import CustomerOrderCancelDetail from '@project-lc/components-web-kkshow/mypage/exchange-return-cancel/detailPage/CustomerOrderCancelDetail';
import { useRouter } from 'next/router';

export function OrderCancelDetailPage(): JSX.Element {
  const router = useRouter();
  const { cancelCode } = router.query;
  return (
    <CustomerMypageLayout title="재배송/환불 신청 내역">
      <Box p={[2, 2, 4]}>
        <CustomerOrderCancelDetail cancelCode={cancelCode as string} />
      </Box>
    </CustomerMypageLayout>
  );
}

export default OrderCancelDetailPage;
