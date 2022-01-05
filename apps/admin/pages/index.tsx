import { Box, Flex } from '@chakra-ui/react';
import { AdminLoginForm } from '@project-lc/components-admin/AdminLoginForm';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function Login(): JSX.Element {
  return (
    <Box position="relative">
      <Flex align="center" justify="center" minH="calc(100vh - 200px)">
        <AdminLoginForm enableShadow />
      </Flex>
    </Box>
  );
}

export default Login;
