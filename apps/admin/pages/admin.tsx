import { Box, Text, Flex } from '@chakra-ui/react';
import { AdminPageLayout, AdminLoginForm } from '@project-lc/components';

export function Index(): JSX.Element {
  return (
    <AdminPageLayout>
      <Box h={200} bgColor="red.200" as="section">
        <Text>some components1</Text>
        {/* 가입한 광고주의 정산 내역 */}
      </Box>
      <Box h={200} bgColor="blue.200" as="section">
        <Text>some components2</Text>
        {/* 가입한 광고주의 사업자 등록증 등록 내역 */}
      </Box>
    </AdminPageLayout>
  );
}

export default Index;
