import {
  MypageLayout,
  ProfileBox,
  PasswordSection,
  AccountRemoveSection,
  SocialAccountUnlinkSection,
} from '@project-lc/components';
import { Heading, VStack, Divider } from '@chakra-ui/react';
import React from 'react';

export function Setting(): JSX.Element {
  return (
    <MypageLayout>
      <VStack spacing={4} maxWidth="3xl" alignItems="stretch" p={2}>
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
    </MypageLayout>
  );
}

export default Setting;
