import { Box, Heading, Text, useDisclosure, Flex, VStack } from '@chakra-ui/react';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import { useProfile, useCustomerInfo } from '@project-lc/hooks';
import { PasswordCheckForm } from '@project-lc/components-shared/PasswordCheckForm';
import { useEffect, useState } from 'react';
import { UserInfo } from '@project-lc/components-web-kkshow/mypage/info/UserInfo';

export function Info(): JSX.Element {
  const { data: profileData } = useProfile();
  const { onClose } = useDisclosure();
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
    <CustomerMypageLayout>
      <Box p={3}>
        <Heading>내 정보 수정</Heading>

        {!isValidated && (
          <VStack>
            <Text>
              회원님의 개인정보를 안전하게 보호하기 위해 인증 후 변경이 가능합니다.
            </Text>
            <Flex
              p={3}
              border="solid 1px"
              borderColor="gray.300"
              borderRadius="5px"
              w="xs"
              direction="column"
              alignItems="space-between"
              justifyContent="flex-start"
            >
              <Flex mb={5}>
                <Text mr={2}>이메일:</Text>
                <Text>{profileData?.email}</Text>
              </Flex>
              <Box>
                <Text>비밀번호 입력</Text>
                <PasswordCheckForm
                  email={profileData?.email}
                  onCancel={onClose}
                  onConfirm={onConfirm}
                />
              </Box>
            </Flex>
          </VStack>
        )}
        {isValidated && profileData && <UserInfo userId={profileData.id} />}
      </Box>
    </CustomerMypageLayout>
  );
}

export default Info;
