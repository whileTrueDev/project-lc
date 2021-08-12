import { Button, useBoolean } from '@chakra-ui/react';
import { useSocialLogin } from '@project-lc/hooks';

export function KakaoLoginButton(): JSX.Element {
  const [enableLogin, setEnableLogin] = useBoolean();
  const { isFetching } = useSocialLogin('kakao', {
    enabled: enableLogin,
    onSettled: () => setEnableLogin.off(),
  });
  return (
    <Button isFullWidth onClick={setEnableLogin.on} isLoading={isFetching}>
      카카오 로그인
    </Button>
  );
}

export default KakaoLoginButton;
