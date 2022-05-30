import { Box, Divider } from '@chakra-ui/react';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import { CustomerMypageMobileSidebar } from '@project-lc/components-web-kkshow/mypage/CustomerMypageSidebar';
import { CustomerStatusSection } from '@project-lc/components-web-kkshow/mypage/CustomerStatusSection';
import CustomerOrderList from '@project-lc/components-web-kkshow/mypage/orderList/CustomerOrderList';
import { useProfile } from '@project-lc/hooks';

export function Index(): JSX.Element {
  const { data } = useProfile();
  return (
    <CustomerMypageLayout>
      <CustomerStatusSection />
      {/* 데스크탑 화면일 때 - 주문목록 표시 */}
      <Box display={{ base: 'none', md: 'block' }} p={[2, 2, 4]}>
        {data && <CustomerOrderList customerId={data.id} />}
      </Box>
      {/* 모바일 화면일 때 마이페이지 메뉴 목록 표시 */}
      <Box display={{ base: 'block', md: 'none' }}>
        <Divider />
        <CustomerMypageMobileSidebar />
      </Box>
    </CustomerMypageLayout>
  );
}

export default Index;
