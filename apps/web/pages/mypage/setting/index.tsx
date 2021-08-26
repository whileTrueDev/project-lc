import {
  MypageLayout,
  ProfileBox,
  PasswordSection,
  AccountRemoveSection,
  SocialAccountUnlinkSection,
} from '@project-lc/components';
import { Heading, VStack, Divider, Container } from '@chakra-ui/react';
import React from 'react';

export function Setting(): JSX.Element {
  return (
    <MypageLayout>
      <Container maxWidth="2xl" p={6}>
        <VStack spacing={4} alignItems="stretch">
          <Heading mb={4}>내계정</Heading>
          <ProfileBox />
          <Divider />
          <PasswordSection />
          <Divider />
          <AccountRemoveSection />
          <Divider />
          <SocialAccountUnlinkSection />
          <Divider />
        </VStack>
      </Container>
    </MypageLayout>
  );
}

export default Setting;
