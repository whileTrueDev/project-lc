import { Button } from '@chakra-ui/react';
import { ChakraNextImage } from './ChakraNextImage';
import naverLogo from '../../docs/naver.png';

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
    >
      <ChakraNextImage src={naverLogo} width="40" height="40" mr={4} />
      네이버 로그인
    </Button>
  );
}

export default NaverLoginButton;
