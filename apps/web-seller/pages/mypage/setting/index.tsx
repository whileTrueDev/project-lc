import { Container, Divider, VStack } from '@chakra-ui/react';
import { AccountRemoveSection } from '@project-lc/components-seller/AccountRemoveSection';
import { ContractionAgreeSection } from '@project-lc/components-shared/ContractionAgreeSection';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';
import { PasswordSection } from '@project-lc/components-shared/PasswordSection';
import { ProfileBox } from '@project-lc/components-shared/ProfileBox';
import { SocialAccountUnlinkSection } from '@project-lc/components-shared/SocialAccountUnlinkSection';
import React from 'react';

export function Setting(): JSX.Element {
  return (
    <MypageLayout>
      <Container maxWidth="2xl" p={6}>
        <VStack spacing={6} alignItems="stretch">
          <ProfileBox allowAvatarChange />
          <Divider />
          <PasswordSection />
          <Divider />
          <ContractionAgreeSection userType="seller" />
          <Divider />
          <SocialAccountUnlinkSection />
          <Divider />
          <AccountRemoveSection />
          <Divider />
        </VStack>
      </Container>
    </MypageLayout>
  );
}

export default Setting;
