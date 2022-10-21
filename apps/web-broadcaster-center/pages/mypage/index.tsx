import { Container, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import { broadcasterCenterMypageNavLinks } from '@project-lc/components-constants/navigation';
import { SettingNeedAlertBox } from '@project-lc/components-core/SettingNeedAlertBox';
import { GuideContractionAgreementSection } from '@project-lc/components-shared/guide/GuideContractionAgreementSection';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';
import { MypageNoticeSection } from '@project-lc/components-shared/MypageNoticeSection';
import { StartGuide } from '@project-lc/components-shared/StartGuide';
import { AddressSection } from '@project-lc/components-web-bc/AddressSection';
import { BroadcasterStatusSection } from '@project-lc/components-web-bc/BroadcasterStatusSection';
import { ChannelSection } from '@project-lc/components-web-bc/ChannelSection';
import { LiveShoppingMonitorSection } from '@project-lc/components-web-bc/LiveShoppingMonitorSection';
import { MypageLiveShoppingSection } from '@project-lc/components-web-bc/MypageLiveShoppingSection';
import { OverayUrlSection } from '@project-lc/components-web-bc/OverayUrlSection';
import { OverlayUrlCard } from '@project-lc/components-web-bc/OverlayUrlCard';
import { PromotionPageUrlCard } from '@project-lc/components-web-bc/PromotionPageUrlCard';
import { SettlementsSection } from '@project-lc/components-web-bc/SettlementsSection';
import { StartGuideCard } from '@project-lc/components-web-bc/StartGuideCard';
import { useBroadcasterContacts, useProfile } from '@project-lc/hooks';
import { useEffect, useMemo } from 'react';

const steps = [
  {
    label: '이용약관 동의',
    component: <GuideContractionAgreementSection userType="broadcaster" />,
  },
  {
    label: '연락처 등록',
    component: <AddressSection />,
  },
  {
    label: '채널링크 등록',
    component: <ChannelSection />,
  },
  {
    label: '라이브 쇼핑 준비',
    component: <OverayUrlSection />,
  },
  {
    label: '라이브 쇼핑 화면',
    component: <LiveShoppingMonitorSection />,
  },
  {
    label: '수익금 출금',
    component: <SettlementsSection />,
  },
];

export function Index(): JSX.Element {
  const { data: broadcasterProfileData } = useProfile();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const broadcasterContacts = useBroadcasterContacts(broadcasterProfileData?.id);

  // 기본연락처존재여부
  const isDefaultContactExist = useMemo<boolean>(() => {
    return broadcasterContacts.data?.length !== 0;
  }, [broadcasterContacts]);

  // 표시할 연락처 - 기본연락처 데이터가 없으면 미등록 리턴
  const displayContactData = useMemo<{
    phoneNumber: string;
    email: string;
  }>(() => {
    if (!broadcasterContacts.isLoading && broadcasterContacts.data?.length !== 0) {
      if (broadcasterContacts?.data) {
        return {
          phoneNumber: broadcasterContacts?.data[0]?.phoneNumber,
          email: broadcasterContacts?.data[0]?.email,
        };
      }
    }
    return {
      phoneNumber: '미등록',
      email: '미등록',
    };
  }, [broadcasterContacts]);

  // 기본 연락처 부재시에 시작가이드 실행영역
  useEffect(() => {
    if (!isDefaultContactExist) onOpen();
  }, [onOpen, isDefaultContactExist]);

  return (
    <MypageLayout appType="broadcaster" navLinks={broadcasterCenterMypageNavLinks}>
      <Container maxW="7xl" p={[1, 6, 6, 6]}>
        {/* 방송인 기본 정보 영역 */}
        {isDefaultContactExist ? (
          <Grid m={2} templateColumns="1fr">
            <GridItem colSpan={{ base: 2, xl: 1 }}>
              <BroadcasterStatusSection status={displayContactData} />
            </GridItem>
          </Grid>
        ) : (
          <Grid m={2} templateColumns="1fr">
            <GridItem>
              <SettingNeedAlertBox
                title="시작 가이드 진행이 필요합니다."
                text="시작 가이드를 진행하여 연락처 정보를 등록해주세요."
              />
            </GridItem>
          </Grid>
        )}

        <Grid
          m={2}
          templateColumns={
            !broadcasterProfileData?.broadcasterPromotionPage
              ? 'repeat(4, 1fr)'
              : 'repeat(6, 1fr)'
          }
          gap={2}
        >
          <GridItem colSpan={{ base: 6, lg: 2 }}>
            {/* 시작 가이드 영역 */}
            <StartGuideCard onOpen={onOpen} />
          </GridItem>
          <GridItem colSpan={{ base: 6, lg: 2 }}>
            {/* 오버레이 URL 영역 */}
            <OverlayUrlCard />
          </GridItem>
          {/* 상품홍보 페이지 URL 영역 */}
          <GridItem colSpan={{ base: 6, lg: 2 }}>
            <PromotionPageUrlCard />
          </GridItem>
        </Grid>

        {/* 라이브 쇼핑 영역 */}
        <MypageLiveShoppingSection />

        {/* 공지사항 영역 */}
        <Grid m={2} pt={1} templateColumns="repeat(2, 1fr)">
          <GridItem colSpan={{ base: 2 }} alignItems="stretch">
            <MypageNoticeSection />
          </GridItem>
        </Grid>
      </Container>

      <StartGuide isOpen={isOpen} onClose={onClose} steps={steps} />
    </MypageLayout>
  );
}

export default Index;
