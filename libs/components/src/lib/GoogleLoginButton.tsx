import { Button } from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { getApiHost } from '@project-lc/utils';
import { UserType, USER_TYPE_KEY } from '@project-lc/shared-types';

export interface UserTypeProps {
  userType: UserType;
}
export function GoogleLoginButton({ userType }: UserTypeProps): JSX.Element {
  return (
    <Button
      as="a"
      isFullWidth
      href={`${getApiHost()}/social/google/login?${USER_TYPE_KEY}=${userType}`}
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
