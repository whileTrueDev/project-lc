import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Link } from '@chakra-ui/react';
import { LiveShoppingList } from '@project-lc/components-seller/LiveShoppingList';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';
import NextLink from 'next/link';

export function Live(): JSX.Element {
  return (
    <MypageLayout>
      <Box m={[2, 4]}>
        <NextLink href="/mypage/live/regist" passHref>
          <Link href="/mypage/live/regist">
            <Button size="sm" colorScheme="blue" leftIcon={<AddIcon />}>
              라이브 쇼핑 진행 요청
            </Button>
          </Link>
        </NextLink>

        <Box mt={4}>
          <LiveShoppingList />
        </Box>
      </Box>
    </MypageLayout>
  );
}

export default Live;
