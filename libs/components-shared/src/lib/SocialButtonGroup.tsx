import { Divider, Stack, Text, VStack } from '@chakra-ui/react';
import GoogleLoginButton, { UserTypeProps } from './GoogleLoginButton';
import KakaoLoginButton from './KakaoLoginButton';
// import NaverLoginButton from './NaverLoginButton';

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
      {/* 
      임시제거 220822 by dan
      연관 일감: [크크쇼,api] 네이버 소셜 로그인 일시 중단 (@[소셜 로그인] 네이버 소셜로그인시 네이버 nickname이 크크쇼 이름으로 설정됨 해당 일감 작업이후 중단 제거)
      https://www.notion.so/whiletrue/api-1a0ad5939f5a482694feb811e7730bad
      */}
      {/* <NaverLoginButton userType={userType} /> */}
      <KakaoLoginButton userType={userType} />
    </VStack>
  );
}

export default SocialButtonGroup;
