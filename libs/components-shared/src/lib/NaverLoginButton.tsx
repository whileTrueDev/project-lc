import { Button } from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import naverLogo from '@project-lc/components-core/images/naver.png';
import { useNextpageUrlParam } from '@project-lc/hooks';
import { USER_TYPE_KEY } from '@project-lc/shared-types';
import { getApiHost } from '@project-lc/utils';
import { useMemo } from 'react';
import { UserTypeProps } from './GoogleLoginButton';

const NAVER_COLOR = '#03c75a';
export function NaverLoginButton({ userType }: UserTypeProps): JSX.Element {
  const nextPage = useNextpageUrlParam();
  const href = useMemo(() => {
    const defaultHref = `${getApiHost()}/social/naver/login?${USER_TYPE_KEY}=${userType}`;
    if (nextPage) return `${defaultHref}&nextpage=${nextPage}`;
    return defaultHref;
  }, [nextPage, userType]);
  return (
    <Button
      as="a"
      isFullWidth
      href={href}
      bg={NAVER_COLOR}
      boxShadow="md"
      _hover={{ boxShadow: 'lg' }}
      leftIcon={<ChakraNextImage src={naverLogo} width="24" height="24" />}
      color="white"
    >
      네이버 로그인
    </Button>
  );
}

export default NaverLoginButton;
