import { Box, Flex } from '@chakra-ui/react';
import { Navbar, LoginForm } from '@project-lc/components';

export function Login(): JSX.Element {
  return (
    <Box>
      <Navbar />
      <Flex align="center" justify="center" minH="calc(100vh - 200px)">
        <LoginForm enableShadow />
      </Flex>
    </Box>
  );
}

export default Login;
