import {
  MypageLayout,
  broadcasterCenterMypageNavLinks,
  MypageNoticeSection,
  BroadcasterStatusSection,
  StartGuideCard,
  UrlCard,
  MypageLiveShoppingSection,
  SettingNeedAlertBox,
  StartGuideSection,
} from '@project-lc/components';
import { Container, Grid, GridItem, Box, useDisclosure } from '@chakra-ui/react';
import { useProfile, useBroadcasterContacts } from '@project-lc/hooks';
import { useEffect, useMemo } from 'react';

export function Index(): JSX.Element {
  const { data: broadcasterProfileData } = useProfile();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const broadcasterContacts = useBroadcasterContacts(broadcasterProfileData?.id);

  const 기본연락처존재여부 = useMemo<boolean>(() => {
    return !broadcasterContacts.isLoading && broadcasterContacts.data?.length !== 0;
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
  }, []);

  return (
    <MypageLayout appType="broadcaster" navLinks={broadcasterCenterMypageNavLinks}>
      <Container maxW="7xl" p={[1, 6, 6, 6]}>
        {/* 방송인 기본 정보 영역 */}
        {기본연락처존재여부 ? (
          <BroadcasterStatusSection status={기본연락처} />
        ) : (
          <Box m={2} maxW="700">
            <SettingNeedAlertBox
              title="시작 가이드 진행이 필요합니다."
              text="시작 가이드를 진행하여 연락처 정보를 등록해주세요."
            />
          </Box>
        )}
        <Grid templateColumns="1fr 1fr" m={2} gap={2}>
          <GridItem>
            {/* 시작 가이드 영역 */}
            <StartGuideCard onOpen={onOpen} />
          </GridItem>
          <GridItem>
            {/* 오버레이 URL 영역 */}
            <UrlCard />
          </GridItem>
        </Grid>
        {/* 라이브 쇼핑 영역 */}
        <MypageLiveShoppingSection />
        <Grid p={2} pt={1} gap={3} templateColumns="repeat(7, 1fr)">
          <GridItem colSpan={{ base: 7, lg: 5 }} alignItems="stretch">
            {/* 공지사항 영역 */}
            <MypageNoticeSection />
          </GridItem>
        </Grid>
      </Container>
      <StartGuideSection isOpen={isOpen} onClose={onClose} />
    </MypageLayout>
  );
}

export default Index;
