import { Container, Divider, Heading, VStack } from '@chakra-ui/react';
import {
  broadcasterCenterMypageNavLinks,
  BroadcasterAddressSection,
  BroadcasterNickNameSection,
  MypageLayout,
} from '@project-lc/components';

export function SettingIndex(): JSX.Element {
  return (
    <MypageLayout siteType="broadcaster" navLinks={broadcasterCenterMypageNavLinks}>
      <Container maxWidth="2xl" p={6}>
        <VStack spacing={4} alignItems="stretch">
          <Heading mb={4}>내 계정</Heading>
          <div>계정정보</div>
          <Divider />
          <BroadcasterNickNameSection />
          <Divider />
          <BroadcasterAddressSection />
        </VStack>
      </Container>
    </MypageLayout>
  );
}

export default SettingIndex;
