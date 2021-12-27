import { Container, Divider, Heading, VStack } from '@chakra-ui/react';
import {
  BroadcasterAddressSection,
  broadcasterCenterMypageNavLinks,
  BroadcasterChannelSection,
  BroadcasterContactSection,
  BroadcasterNickNameSection,
  BroadcasterSignoutSection,
  ContractionAgreeSection,
  MypageLayout,
  PasswordSection,
  ProfileBox,
  SocialAccountUnlinkSection,
} from '@project-lc/components';

export function SettingIndex(): JSX.Element {
  return (
    <MypageLayout appType="broadcaster" navLinks={broadcasterCenterMypageNavLinks}>
      <Container maxWidth="2xl" p={6}>
        <VStack spacing={4} alignItems="stretch">
          <Heading mb={4}>내 계정</Heading>
          <ProfileBox allowAvatarChange />
          <Divider />
          <BroadcasterNickNameSection />
          <Divider />
          <PasswordSection />
          <Divider />
          <ContractionAgreeSection />
          <Divider />
          <BroadcasterAddressSection />
          <Divider />
          <BroadcasterContactSection />
          <Divider />
          <BroadcasterChannelSection />
          <Divider />
          <SocialAccountUnlinkSection userType="broadcaster" />
          <Divider />
          <BroadcasterSignoutSection />
        </VStack>
      </Container>
    </MypageLayout>
  );
}

export default SettingIndex;
