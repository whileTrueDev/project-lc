import { Box, Heading, Text } from '@chakra-ui/react';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import { useProfile } from '@project-lc/hooks';
import { Profile } from '@project-lc/components-web-kkshow/mypage/info/Profile';

export function Info(): JSX.Element {
  const { data, isLoading } = useProfile();

  return (
    <CustomerMypageLayout>
      <Box p={3}>
        <Heading>내 정보 수정</Heading>
        <Text>비밀번호 입력 이후, 조회 가능합니다</Text>
        <Profile data={data} />
      </Box>
    </CustomerMypageLayout>
  );
}

export default Info;
