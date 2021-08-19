import { Divider, Text, VStack } from '@chakra-ui/react';
import GoogleLoginButton from './GoogleLoginButton';
import KakaoLoginButton from './KakaoLoginButton';
import NaverLoginButton from './NaverLoginButton';

export function SocialButtonGroup(): JSX.Element {
  return (
    <VStack spacing={2}>
      <Text>소셜 계정으로 시작하기</Text>
      <Divider />
      <GoogleLoginButton />
      <NaverLoginButton />
      <KakaoLoginButton />
    </VStack>
  );
}

export default SocialButtonGroup;
