import { useEffect } from 'react';
import { Container, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';
import { MypageNoticeSection } from '@project-lc/components-shared/MypageNoticeSection';
import { MypageStatsSection } from '@project-lc/components-seller/MypageStatsSection';
import { SellerStatusSection } from '@project-lc/components-seller/SellerStatusSection';
import { StartGuide } from '@project-lc/components-shared/StartGuide';
import { useProfile } from '@project-lc/hooks';
import { ShopNameSection } from '@project-lc/components-seller/ShopNameSection';
import { GuideContractionAgreementSection } from '@project-lc/components-shared/guide/GuideContractionAgreementSection';

export function Index(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: sellerInfo, isLoading } = useProfile();
  const agreementFlag = sellerInfo?.agreementFlag || '';

  const steps = [
    {
      label: '이용약관 동의',
      component: <GuideContractionAgreementSection userType="seller" />,
    },
    {
      label: '상점명 등록',
      component: <ShopNameSection />,
    },
  ];

  useEffect(() => {
    if (!isLoading && !agreementFlag) {
      onOpen();
    }
  }, [isLoading, onOpen, agreementFlag]);
  return (
    <MypageLayout>
      <Container maxW="7xl" p={[1, 6, 6, 6]}>
        {/* 판매자 검수상태 영역 */}
        <SellerStatusSection />
        {/* 마이페이지 요약지표 영역 */}
        <MypageStatsSection />

        <Grid p={2} pt={1} gap={3} templateColumns="repeat(7, 1fr)">
          <GridItem colSpan={{ base: 7, lg: 5 }} alignItems="stretch">
            {/* 공지사항 영역 */}
            <MypageNoticeSection />
          </GridItem>
        </Grid>
        {/** 시작가이드 */}
        <StartGuide isOpen={isOpen} onClose={onClose} steps={steps} />
      </Container>
    </MypageLayout>
  );
}

export default Index;
