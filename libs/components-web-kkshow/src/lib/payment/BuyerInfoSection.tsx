import { Box, Heading, HStack, Text, Divider } from '@chakra-ui/react';
import { useProfile, useCustomerInfo } from '@project-lc/hooks';

export function BuyerInfoSection(): JSX.Element {
  const { data: profile } = useProfile();

  const { data } = useCustomerInfo(1); // profile?.id

  return (
    <Box>
      <Heading>구매자정보</Heading>
      <Divider m={2} />
      <HStack>
        <Text fontWeight="bold">이름</Text>
        <Text>{profile?.name}</Text>
      </HStack>
      <HStack>
        <Text fontWeight="bold">이메일</Text>
        <Text>{profile?.email}</Text>
      </HStack>
      <HStack>
        <Text fontWeight="bold">휴대전화번호</Text>
        <Text>{data?.phone}</Text>
      </HStack>
    </Box>
  );
}
