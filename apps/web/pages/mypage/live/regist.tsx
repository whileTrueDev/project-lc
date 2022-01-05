import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, Button, Container, Flex } from '@chakra-ui/react';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';
import { LiveShoppingRegistForm } from '@project-lc/components/LiveShoppingRegistForm';
import { useRouter } from 'next/router';

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
        <LiveShoppingRegistForm />
      </Container>
    </MypageLayout>
  );
}

export default Live;
