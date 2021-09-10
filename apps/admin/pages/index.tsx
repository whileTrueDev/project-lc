import { Box, Text, Flex } from '@chakra-ui/react';
import { AdminPageLayout, AdminLoginForm } from '@project-lc/components';

export function Login(): JSX.Element {
  return (
    <AdminPageLayout>
      <Flex align="center" justify="center" minH="calc(100vh - 200px)">
        {/* <Box h={200} bgColor="red.200" as="section">
          <Text>some components1</Text>
        </Box>
        <Box h={200} bgColor="blue.200" as="section">
          <Text>some components2</Text>
        </Box> */}
        <AdminLoginForm enableShadow />
      </Flex>
    </AdminPageLayout>
  );
}

export default Login;
