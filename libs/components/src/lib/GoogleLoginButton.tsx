import { Button } from '@chakra-ui/react';
import { ChakraNextImage } from './ChakraNextImage';
import googleLogo from '../../docs/google.png';

export function GoogleLoginButton(): JSX.Element {
  return (
    <Button
      as="a"
      isFullWidth
      href="http://localhost:3000/social/google/login"
      bg="white"
      color="black"
      _hover={{ bg: 'white', color: 'gray.300' }}
      boxShadow="md"
    >
      <ChakraNextImage src={googleLogo} width="40" height="40" mr={4} />
      구글로 로그인
    </Button>
  );
}

export default GoogleLoginButton;
