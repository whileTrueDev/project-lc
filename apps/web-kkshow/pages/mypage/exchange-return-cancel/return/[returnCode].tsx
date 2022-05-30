import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import { useRouter } from 'next/router';
import CustomerReturnDetail from '@project-lc/components-web-kkshow/mypage/exchange-return-cancel/detailPage/CustomerReturnDetail';
import { Box } from '@chakra-ui/react';

export function ReturnDetailPage(): JSX.Element {
  const router = useRouter();
  const { returnCode } = router.query;
  return (
    <CustomerMypageLayout>
      <Box p={[2, 2, 4]}>
        <CustomerReturnDetail returnCode={returnCode as string} />
      </Box>
    </CustomerMypageLayout>
  );
}

export default ReturnDetailPage;
