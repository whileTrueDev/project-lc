import { Button } from '@chakra-ui/react';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { getApiHost } from '@project-lc/utils';
import { NEXT_PAGE_PARAM_KEY, USER_TYPE_KEY } from '@project-lc/shared-types';
import { useNextpageUrlParam } from '@project-lc/hooks';
import { useMemo } from 'react';
import { UserTypeProps } from './GoogleLoginButton';

const KAKAO_COLOR = '#FEE500';
export function KakaoLoginButton({ userType }: UserTypeProps): JSX.Element {
  const nextPage = useNextpageUrlParam();
  const href = useMemo(() => {
    const defaultHref = `${getApiHost()}/social/kakao/login?${USER_TYPE_KEY}=${userType}`;
    if (nextPage) return `${defaultHref}&${NEXT_PAGE_PARAM_KEY}=${nextPage}`;
    return defaultHref;
  }, [nextPage, userType]);
  return (
    <Button
      as="a"
      isFullWidth
      href={href}
      bg={KAKAO_COLOR}
      color="black"
      boxShadow="md"
      _hover={{ boxShadow: 'lg' }}
      leftIcon={<RiKakaoTalkFill />}
    >
      카카오 로그인
    </Button>
  );
}

export default KakaoLoginButton;
