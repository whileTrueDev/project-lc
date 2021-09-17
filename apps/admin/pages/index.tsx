import { Box, Text, Flex } from '@chakra-ui/react';
import { AdminPageLayout, AdminLoginForm } from '@project-lc/components';

export function Login(): JSX.Element {
  return (
    <AdminPageLayout>
      <Flex align="center" justify="center" minH="calc(100vh - 200px)">
        <AdminLoginForm enableShadow />
      </Flex>
    </AdminPageLayout>
  );
}

export default Login;
