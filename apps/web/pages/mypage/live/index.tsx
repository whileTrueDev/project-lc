import { MypageLayout, LiveShoppingList } from '@project-lc/components';
import { Heading, Container, Link, Button, Stack } from '@chakra-ui/react';

export function Live(): JSX.Element {
  return (
    <MypageLayout>
      <Container maxWidth="container.xl" my={12}>
        <Heading>라이브 쇼핑 목록</Heading>
        <Stack direction="row" p={2} justifyContent="flex-end">
          <Link href="/mypage/live/regist">
            <Button colorScheme="blue">라이브 등록</Button>
          </Link>
        </Stack>
        <LiveShoppingList />
      </Container>
    </MypageLayout>
  );
}

export default Live;
