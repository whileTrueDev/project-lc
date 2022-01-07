import { Stack, Text } from '@chakra-ui/react';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';

export function Index(): JSX.Element {
  return (
    <AdminPageLayout>
      <Stack justifyContent="center" alignItems="center">
        <Text>크크쇼 관리자 페이지에 오신것을 환영합니다</Text>
        <Text fontSize="9xl">😄</Text>
        <Text>오늘도 화이팅!</Text>
      </Stack>
    </AdminPageLayout>
  );
}

export default Index;
