import { Button, useBoolean } from '@chakra-ui/react';
import { getApiHost } from '@project-lc/hooks';

export function NaverLoginButton(): JSX.Element {
  return (
    <Button as="a" isFullWidth href={`${getApiHost()}/social/naver/login`}>
      네이버 로그인
    </Button>
  );
}

export default NaverLoginButton;
