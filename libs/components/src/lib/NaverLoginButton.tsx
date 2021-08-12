import { Button, useBoolean } from '@chakra-ui/react';

export function NaverLoginButton(): JSX.Element {
  return (
    <Button as="a" isFullWidth href="http://localhost:3000/auth/social/naver/login">
      네이버 로그인
    </Button>
  );
}

export default NaverLoginButton;
