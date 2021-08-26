import { Box, Flex } from '@chakra-ui/react';
import { Navbar, LoginForm } from '@project-lc/components';
import { useMoveToMainIfLoggedIn } from '@project-lc/hooks';
import React from 'react';

export function Login(): JSX.Element {
  useMoveToMainIfLoggedIn();
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
