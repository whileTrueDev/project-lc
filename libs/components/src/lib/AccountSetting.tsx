import { Heading, VStack, Divider } from '@chakra-ui/react';
import AccountRemoveSection from './AccountRemoveSection';
import PasswordSection from './PasswordSection';
import ProfileBox from './ProfileBox';
import SocialAccountUnlinkSection from './SocialAccountUnlinkSection';

export function AccountSetting(): JSX.Element {
  return (
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
  );
}

export default AccountSetting;
