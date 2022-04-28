import { Box } from '@chakra-ui/react';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import { CustomerMypageMobileSidebar } from '@project-lc/components-web-kkshow/mypage/CustomerMypageSidebar';
import { CustomerStatusSection } from '@project-lc/components-web-kkshow/mypage/CustomerStatusSection';

export function Index(): JSX.Element {
  return (
    <CustomerMypageLayout>
      <CustomerStatusSection />
      {/* 데스크탑 화면일 때 */}
      <Box display={{ base: 'none', md: 'block' }}>여기에 주문목록 표시</Box>
      {/* 모바일 화면일 때 마이페이지 메뉴 목록 표시 */}
      <Box display={{ base: 'block', md: 'none' }}>
        <CustomerMypageMobileSidebar />
      </Box>
    </CustomerMypageLayout>
  );
}

export default Index;
