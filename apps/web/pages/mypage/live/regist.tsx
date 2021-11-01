import { MypageLayout, LiveShoppingRegist } from '@project-lc/components';
import { Container, Box, Flex, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ChevronLeftIcon } from '@chakra-ui/icons';

export function Live(): JSX.Element {
  const router = useRouter();

  return (
    <MypageLayout>
      <Container maxWidth="container.xl" my={12}>
        <Box as="section" mb={10}>
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
        <LiveShoppingRegist />
      </Container>
    </MypageLayout>
  );
}

export default Live;
