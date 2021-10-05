import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components';
import { useRouter } from 'next/router';

export function Custom404(): JSX.Element {
  const router = useRouter();
  function toHome(): void {
    router.push('/');
  }
  return (
    <Flex h="100vh" flexDirection="column" justify="center" alignItems="center">
      <VStack spacing={4}>
        <ChakraNextImage
          width={400}
          height={300}
          w="auto"
          h="auto"
          src="https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/virus-4999857.svg"
        />
        <Heading fontSize={{ base: '2xl', sm: '4xl' }}>페이지를 찾을 수 없습니다</Heading>
        <Text fontSize={{ base: 'sm', sm: 'md' }}>
          죄송합니다. 요청하신 페이지가 존재하지 않습니다.
        </Text>
        <Button fontSize={{ base: 'sm', sm: 'md' }} onClick={toHome}>
          홈으로 이동
        </Button>
      </VStack>
    </Flex>
  );
}

export default Custom404;
