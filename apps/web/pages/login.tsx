import { Box, Flex } from '@chakra-ui/react';
import { LoginForm, SellerNavbar } from '@project-lc/components';
import { useMoveToMainIfLoggedIn, useSocialLoginFailAlarm } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import React from 'react';

export function Login(): JSX.Element {
  useMoveToMainIfLoggedIn();

  const router = useRouter();
  useSocialLoginFailAlarm({
    error: router.query.error,
    message: router.query.message,
    provider: router.query.provider,
  });
  return (
    <Box>
      <SellerNavbar />

      <Flex align="center" justify="center" minH="calc(100vh - 200px)">
        <LoginForm enableShadow userType="seller" />
      </Flex>
    </Box>
  );
}

export default Login;
