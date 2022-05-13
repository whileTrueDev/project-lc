import { Button, Flex, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export function Page500(): JSX.Element {
  const router = useRouter();
  return (
    <Flex h="100vh" justify="center" align="center">
      <Stack textAlign="center" spacing={4}>
        <Text>죄송합니다. 페이지에 접근할 수 없습니다.</Text>
        <Button onClick={() => router.push('/')}>메인페이지로</Button>
      </Stack>
    </Flex>
  );
}

export default Page500;
