import { Button, useBoolean } from '@chakra-ui/react';
import { ChakraNextImage } from './ChakraNextImage';
import kakaoLogo from '../../docs/kakao.png';

const KAKAO_COLOR = '#FEE500';
export function KakaoLoginButton(): JSX.Element {
  return (
    <Button
      as="a"
      isFullWidth
      href="http://localhost:3000/social/kakao/login"
      bg={KAKAO_COLOR}
      _hover={{ bg: KAKAO_COLOR, color: 'white' }}
    >
      <ChakraNextImage src={kakaoLogo} width="40" height="40" mr={4} />
      카카오 로그인
    </Button>
  );
}

export default KakaoLoginButton;
