import { Button } from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { getApiHost } from '@project-lc/utils';
import { NEXT_PAGE_PARAM_KEY, UserType, USER_TYPE_KEY } from '@project-lc/shared-types';
import { useNextpageUrlParam } from '@project-lc/hooks';
import { useMemo } from 'react';

export interface UserTypeProps {
  userType: UserType;
}
export function GoogleLoginButton({ userType }: UserTypeProps): JSX.Element {
  const nextPage = useNextpageUrlParam();
  const href = useMemo(() => {
    const defaultHref = `${getApiHost()}/social/google/login?${USER_TYPE_KEY}=${userType}`;
    if (nextPage) return `${defaultHref}&${NEXT_PAGE_PARAM_KEY}=${nextPage}`;
    return defaultHref;
  }, [nextPage, userType]);
  return (
    <Button
      as="a"
      isFullWidth
      href={href}
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
