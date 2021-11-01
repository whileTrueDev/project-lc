import { MypageLayout, LiveShoppingRegist } from '@project-lc/components';
import { Heading, Container, Box, Flex, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ChevronLeftIcon } from '@chakra-ui/icons';

export function Live(): JSX.Element {
  const router = useRouter();

  return (
    <MypageLayout>
      <Container maxWidth="container.xl" my={12}>
        <Box as="section">
          <Flex direction="row" alignItems="center" justifyContent="space-between">
            <Button
              size="sm"
              leftIcon={<ChevronLeftIcon />}
              onClick={() => router.push('/mypage/live')}
            >
              목록으로
            </Button>
          </Flex>
        </Box>
        <Heading>라이브 쇼핑 등록</Heading>
        <LiveShoppingRegist />
      </Container>
    </MypageLayout>
  );
}

export default Live;
