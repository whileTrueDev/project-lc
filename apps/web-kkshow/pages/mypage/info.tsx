import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { PasswordCheckForm } from '@project-lc/components-shared/PasswordCheckForm';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import { UserInfo } from '@project-lc/components-web-kkshow/mypage/info/UserInfo';
import { useProfile } from '@project-lc/hooks';
import { useEffect, useState } from 'react';

export function Info(): JSX.Element {
  const title = '내 정보 수정';
  const { data: profileData } = useProfile();
  const [isValidated, setIsValidated] = useState(false);

  const onConfirm = (): void => {
    setIsValidated(true);
  };

  useEffect(() => {
    // 소셜로그인의 경우 비밀번호가 없을 수 있다
    if (!profileData?.hasPassword) {
      setIsValidated(true);
    }
  }, [setIsValidated, profileData?.hasPassword]);

  return (
    <CustomerMypageLayout title={title}>
      <Box p={[2, 2, 4]}>
        <Text fontSize="xl" fontWeight="bold">
          {title}
        </Text>

        {!isValidated && (
          <Stack mt={1}>
            <Text>
              회원님의 개인정보를 안전하게 보호하기 위해 인증 후 변경이 가능합니다.
            </Text>
            <Stack
              p={3}
              border="solid 1px"
              borderColor="gray.300"
              borderRadius="5px"
              alignItems="space-between"
              justifyContent="flex-start"
              maxW={400}
            >
              <Flex>
                <Text mr={2}>이메일:</Text>
                <Text>{profileData?.email}</Text>
              </Flex>

              <Box>
                <Text>비밀번호</Text>
                <PasswordCheckForm email={profileData?.email} onConfirm={onConfirm} />
              </Box>
            </Stack>
          </Stack>
        )}
        {isValidated && profileData && (
          <Box mt={4}>
            <UserInfo userId={profileData.id} />
          </Box>
        )}
      </Box>
    </CustomerMypageLayout>
  );
}

export default Info;
