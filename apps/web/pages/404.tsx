import { Button, Flex, Heading, Image, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export function Custom404(): JSX.Element {
  const router = useRouter();
  function toHome() {
    router.push('/');
  }
  return (
    <Flex h="100vh" flexDirection="column" justify="center" alignItems="center">
      <VStack spacing={4}>
        <Image src="https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/virus-4999857.svg" />
        <Heading fontSize="4xl">페이지를 찾을 수 없습니다</Heading>
        <Text>죄송합니다. 요청하신 페이지가 존재하지 않습니다.</Text>
        <Button onClick={toHome}>홈으로 이동</Button>
      </VStack>
    </Flex>
  );
}

export default Custom404;
