import { Divider, Stack, Text, VStack } from '@chakra-ui/react';
import GoogleLoginButton, { UserTypeProps } from './GoogleLoginButton';
import KakaoLoginButton from './KakaoLoginButton';
import NaverLoginButton from './NaverLoginButton';

export function SocialButtonGroup({
  userType = 'seller',
}: Partial<UserTypeProps>): JSX.Element {
  return (
    <VStack spacing={2}>
      <Stack
        direction="row"
        width="100%"
        alignItems="center"
        justifyContent="space-between"
      >
        <Divider flex={{ base: 0.2 }} />
        <Text align="center" flex={{ base: 0.5 }} wordBreak="keep-all">
          소셜 계정으로 시작하기
        </Text>
        <Divider flex={{ base: 0.2 }} />
      </Stack>
      <GoogleLoginButton userType={userType} />
      <NaverLoginButton userType={userType} />
      <KakaoLoginButton userType={userType} />
    </VStack>
  );
}

export default SocialButtonGroup;
