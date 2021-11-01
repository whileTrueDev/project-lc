import { Button } from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { getApiHost } from '@project-lc/utils';

export function GoogleLoginButton(): JSX.Element {
  return (
    <Button
      as="a"
      isFullWidth
      href={`${getApiHost()}/social/google/login`}
      bg="white"
      color="black"
      _hover={{ boxShadow: 'lg' }}
      boxShadow="md"
      leftIcon={<FcGoogle />}
    >
      구글로 로그인
    </Button>
  );
}

export default GoogleLoginButton;
