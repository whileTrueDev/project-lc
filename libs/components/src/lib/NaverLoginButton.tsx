import { Button, useBoolean } from '@chakra-ui/react';
import { useSocialLogin } from '@project-lc/hooks';

export function NaverLoginButton(): JSX.Element {
  const [enableLogin, setEnableLogin] = useBoolean();
  const { isFetching } = useSocialLogin('naver', {
    enabled: enableLogin,
    onSettled: () => setEnableLogin.off(),
  });
  return (
    <Button isFullWidth onClick={setEnableLogin.on} isLoading={isFetching}>
      네이버 로그인
    </Button>
  );
}

export default NaverLoginButton;
