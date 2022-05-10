import { Box, Button, Heading, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';

export function Success(): JSX.Element {
  const router = useRouter();
  const failReason = router.query.message;

  return (
    <KkshowLayout>
      <Flex direction="column" alignItems="center" justifyContent="center" p={2}>
        <Heading>결제실패</Heading>
        <Flex
          direction="column"
          bg={useColorModeValue('gray.200', 'gray.700')}
          p={5}
          m={5}
          borderRadius="5px"
        >
          <Text>해당 주문시도가 실패하였습니다.</Text>
          <Box bg={useColorModeValue('yellow.300', 'gray.500')} p={2} borderRadius="5px">
            <Text>사유 : {failReason}</Text>
          </Box>
          <Text>잠시 후 다시 시도해주세요</Text>
          <Button onClick={() => router.push('/shopping')} colorScheme="blue" mt={3}>
            쇼핑탭으로 돌아가기
          </Button>
        </Flex>
      </Flex>
    </KkshowLayout>
  );
}

export default Success;
