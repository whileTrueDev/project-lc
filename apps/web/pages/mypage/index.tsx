import { useDisclosure, Container } from '@chakra-ui/react';
import {
  MypageLayout,
  ShopNameDialog,
  SellerStatusSection,
  MypageStatsSection,
} from '@project-lc/components';

export function Index(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <MypageLayout>
      <SellerStatusSection />
      <Container maxW="7xl" p={[1, 6, 6, 6]}>
        {/* 판매자 검수상태 영역 */}
        <SellerStatusSection />
        {/* 마이페이지 요약지표 영역 */}
        <MypageStatsSection />
        {/* 상점명 입력 다이얼로그 (useProfile 내부에서 사용) */}
        <ShopNameDialog isOpen={isOpen} onOpen={onOpen} onClose={onClose} autoCheck />
      </Container>
    </MypageLayout>
  );
}

export default Index;
