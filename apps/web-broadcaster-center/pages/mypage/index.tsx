import { Container, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import { broadcasterCenterMypageNavLinks } from '@project-lc/components-constants/navigation';
import { SettingNeedAlertBox } from '@project-lc/components-core/SettingNeedAlertBox';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';
import { MypageNoticeSection } from '@project-lc/components-shared/MypageNoticeSection';
import { BroadcasterStatusSection } from '@project-lc/components-web-bc/BroadcasterStatusSection';
import { UrlCard } from '@project-lc/components-web-bc/guide/OverlayUrlCard';
import { MypageLiveShoppingSection } from '@project-lc/components-web-bc/MypageLiveShoppingSection';
import { StartGuideCard } from '@project-lc/components-web-bc/StartGuideCard';
import { StartGuideSection } from '@project-lc/components-web-bc/StartGuideSection';
import { useBroadcasterContacts, useProfile } from '@project-lc/hooks';
import { useEffect, useMemo } from 'react';

export function Index(): JSX.Element {
  const { data: broadcasterProfileData } = useProfile();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const broadcasterContacts = useBroadcasterContacts(broadcasterProfileData?.id);

  const 기본연락처존재여부 = useMemo<boolean>(() => {
    return broadcasterContacts.data?.length !== 0;
  }, [broadcasterContacts]);

  const 기본연락처 = useMemo<{
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
    if (!기본연락처존재여부) {
      onOpen();
    }
  }, [onOpen, 기본연락처존재여부]);

  return (
    <MypageLayout appType="broadcaster" navLinks={broadcasterCenterMypageNavLinks}>
      <Container maxW="7xl" p={[1, 6, 6, 6]}>
        {/* 방송인 기본 정보 영역 */}
        {기본연락처존재여부 ? (
          <Grid m={2} templateColumns="1fr 1fr">
            <BroadcasterStatusSection status={기본연락처} />
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
        <Grid m={2} templateColumns="repeat(2, 1fr)" gap={2}>
          <GridItem colSpan={{ base: 2, lg: 1 }}>
            {/* 시작 가이드 영역 */}
            <StartGuideCard onOpen={onOpen} />
          </GridItem>
          <GridItem colSpan={{ base: 2, lg: 1 }}>
            {/* 오버레이 URL 영역 */}
            <UrlCard />
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
      <StartGuideSection isOpen={isOpen} onClose={onClose} />
    </MypageLayout>
  );
}

export default Index;
