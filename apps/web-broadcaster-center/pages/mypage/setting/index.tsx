import { Container, Divider, Heading, VStack } from '@chakra-ui/react';
import {
  broadcasterCenterMypageNavLinks,
  BroadcasterContactSection,
  BroadcasterAddressSection,
  BroadcasterChannelSection,
  BroadcasterNickNameSection,
  MypageLayout,
  SocialAccountUnlinkSection,
  BroadcasterSignoutSection,
} from '@project-lc/components';

export function SettingIndex(): JSX.Element {
  return (
    <MypageLayout appType="broadcaster" navLinks={broadcasterCenterMypageNavLinks}>
      <Container maxWidth="2xl" p={6}>
        <VStack spacing={4} alignItems="stretch">
          <Heading mb={4}>내 계정</Heading>
          <div>계정정보</div>
          <Divider />
          <BroadcasterNickNameSection />
          <Divider />
          <SocialAccountUnlinkSection userType="broadcaster" />
          <Divider />
          <BroadcasterAddressSection />
          <Divider />
          <BroadcasterContactSection />
          <Divider />
          <BroadcasterChannelSection />
          <Divider />
          <BroadcasterSignoutSection />
        </VStack>
      </Container>
    </MypageLayout>
  );
}

export default SettingIndex;
