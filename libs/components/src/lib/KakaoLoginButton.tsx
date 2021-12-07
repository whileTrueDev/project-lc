import { Button } from '@chakra-ui/react';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { getApiHost } from '@project-lc/utils';
import { USER_TYPE_KEY } from '@project-lc/shared-types';
import { UserTypeProps } from './GoogleLoginButton';

const KAKAO_COLOR = '#FEE500';
export function KakaoLoginButton({ userType }: UserTypeProps): JSX.Element {
  return (
    <Button
      as="a"
      isFullWidth
      href={`${getApiHost()}/social/kakao/login?${USER_TYPE_KEY}=${userType}`}
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
