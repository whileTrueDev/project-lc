import { Button, useBoolean } from '@chakra-ui/react';
import { getApiHost } from '@project-lc/hooks';

export function KakaoLoginButton(): JSX.Element {
  return (
    <Button as="a" isFullWidth href={`${getApiHost()}/social/kakao/login`}>
      카카오 로그인
    </Button>
  );
}

export default KakaoLoginButton;
