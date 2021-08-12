import { Button, useBoolean } from '@chakra-ui/react';
import { useSocialLogin } from '@project-lc/hooks';

export function GoogleLoginButton(): JSX.Element {
  const [enableLogin, setEnableLogin] = useBoolean();
  const { isFetching } = useSocialLogin('google', {
    enabled: enableLogin,
    onSettled: () => setEnableLogin.off(),
  });
  return (
    <Button isFullWidth onClick={setEnableLogin.on} isLoading={isFetching}>
      구글로 로그인
    </Button>
  );
}

export default GoogleLoginButton;
