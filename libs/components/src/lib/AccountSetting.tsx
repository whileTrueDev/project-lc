import { Box, Container, Heading, VStack, Divider } from '@chakra-ui/react';
import AccountRemoveSection from './AccountRemoveSection';

export function AccountSetting(): JSX.Element {
  return (
    <VStack spacing={4} maxWidth="3xl" alignItems="flex-start">
      <Heading>내계정</Heading>
      <AccountRemoveSection />
      <Divider />
    </VStack>
  );
}

export default AccountSetting;
