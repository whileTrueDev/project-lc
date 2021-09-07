import { Button } from '@chakra-ui/react';
import { RiKakaoTalkFill } from 'react-icons/ri';

const KAKAO_COLOR = '#FEE500';
export function KakaoLoginButton(): JSX.Element {
  return (
    <Button
      as="a"
      isFullWidth
      href="http://localhost:3000/social/kakao/login"
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
