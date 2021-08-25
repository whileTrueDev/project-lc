import { Divider, Stack, Text, VStack } from '@chakra-ui/react';
import GoogleLoginButton from './GoogleLoginButton';
import KakaoLoginButton from './KakaoLoginButton';
import NaverLoginButton from './NaverLoginButton';

export function SocialButtonGroup(): JSX.Element {
  return (
    <VStack spacing={2} py={4}>
      <Stack direction="row" width="100%" alignItems="center">
        <Divider flex={1} />
        <Text align="center" flex={1.5}>
          소셜 계정으로 시작하기
        </Text>
        <Divider flex={1} />
      </Stack>
      <GoogleLoginButton />
      <NaverLoginButton />
      <KakaoLoginButton />
    </VStack>
  );
}

export default SocialButtonGroup;
