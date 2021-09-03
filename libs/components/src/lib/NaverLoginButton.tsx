import { Button } from '@chakra-ui/react';
import naverLogo from '../../images/naver.png';
import { ChakraNextImage } from './ChakraNextImage';

const NAVER_COLOR = '#03c75a';
export function NaverLoginButton(): JSX.Element {
  return (
    <Button
      as="a"
      isFullWidth
      href="http://localhost:3000/social/naver/login"
      bg={NAVER_COLOR}
      boxShadow="md"
      _hover={{ boxShadow: 'lg' }}
      leftIcon={<ChakraNextImage src={naverLogo} width="24" height="24" />}
      color="white"
    >
      네이버 로그인
    </Button>
  );
}

export default NaverLoginButton;
