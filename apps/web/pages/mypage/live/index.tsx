import { MypageLayout, LiveShoppingList } from '@project-lc/components';
import { Heading, Container, Button, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export function Live(): JSX.Element {
  const router = useRouter();
  return (
    <MypageLayout>
      <Container maxWidth="container.xxl" my={12}>
        <Heading>라이브 쇼핑 목록</Heading>
        <Stack direction="row" p={2} justifyContent="flex-end">
          <Button colorScheme="blue" onClick={() => router.push('/mypage/live/regist')}>
            라이브 쇼핑 진행 요청
          </Button>
        </Stack>

        <LiveShoppingList />
      </Container>
    </MypageLayout>
  );
}

export default Live;
