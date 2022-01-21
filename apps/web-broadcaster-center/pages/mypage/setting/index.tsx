import { Container, Divider, VStack } from '@chakra-ui/react';
import { broadcasterCenterMypageNavLinks } from '@project-lc/components-constants/navigation';
import { ContractionAgreeSection } from '@project-lc/components-shared/ContractionAgreeSection';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';
import { PasswordSection } from '@project-lc/components-shared/PasswordSection';
import { ProfileBox } from '@project-lc/components-shared/ProfileBox';
import { SocialAccountUnlinkSection } from '@project-lc/components-shared/SocialAccountUnlinkSection';
import { BroadcasterAddressSection } from '@project-lc/components-web-bc/BroadcasterAddress';
import { BroadcasterChannelSection } from '@project-lc/components-web-bc/BroadcasterChannelSection';
import { BroadcasterContactSection } from '@project-lc/components-web-bc/BroadcasterContact';
import { BroadcasterNickNameSection } from '@project-lc/components-web-bc/BroadcasterNickName';
import { BroadcasterSignoutSection } from '@project-lc/components-web-bc/BroadcasterSignoutSection';

export function SettingIndex(): JSX.Element {
  return (
    <MypageLayout appType="broadcaster" navLinks={broadcasterCenterMypageNavLinks}>
      <Container maxWidth="2xl" p={6}>
        <VStack spacing={6} alignItems="stretch">
          <ProfileBox allowAvatarChange />
          <Divider />
          <BroadcasterNickNameSection />
          <Divider />
          <PasswordSection />
          <Divider />
          <ContractionAgreeSection userType="broadcaster" />
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
