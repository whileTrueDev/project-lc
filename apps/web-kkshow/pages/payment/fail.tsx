import { Box, Button, Heading, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';

export function Success(): JSX.Element {
  const router = useRouter();
  const failReason = router.query.message;

  return (
    <KkshowLayout>
      <Flex direction="column" alignItems="center" justifyContent="center" p={2} mt={10}>
        <Heading>주문에 실패했습니다</Heading>
        <Flex
          direction="column"
          bg={useColorModeValue('gray.200', 'gray.700')}
          p={5}
          m={5}
          w={{ base: 'xs', md: '2xl' }}
          borderRadius="5px"
        >
          <Text>해당 주문시도가 실패하였습니다.</Text>
          <Text>잠시 후 다시 시도해주세요.</Text>
          <Box
            bg={useColorModeValue('yellow.100', 'gray.500')}
            p={2}
            borderRadius="5px"
            mt={5}
          >
            <Text fontWeight="bold">사유 : {failReason}</Text>
          </Box>
          <Button onClick={() => router.push('/cart')} colorScheme="blue" mt={3}>
            장바구니로 돌아가기
          </Button>
          <Button
            onClick={() => router.push('/shopping')}
            mt={3}
            variant="outline"
            colorScheme="blue"
          >
            쇼핑탭으로 돌아가기
          </Button>
        </Flex>
      </Flex>
    </KkshowLayout>
  );
}

export default Success;
