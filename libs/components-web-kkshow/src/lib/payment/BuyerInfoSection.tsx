import {
  Box,
  Heading,
  VStack,
  Flex,
  HStack,
  Text,
  Grid,
  Divider,
} from '@chakra-ui/react';

export function BuyerInfoSection(): JSX.Element {
  return (
    <Box>
      <Heading>구매자정보</Heading>
      <Divider m={2} />
      <HStack>
        <Text fontWeight="bold">이름</Text>
        <Text>이진은</Text>
      </HStack>
      <HStack>
        <Text fontWeight="bold">이메일</Text>
        <Text>iamironman@onad.io</Text>
      </HStack>
      <HStack>
        <Text fontWeight="bold">휴대전화번호</Text>
        <Text>010-1234-1234</Text>
      </HStack>
    </Box>
  );
}
