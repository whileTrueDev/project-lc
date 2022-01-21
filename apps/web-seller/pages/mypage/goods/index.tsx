import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Link } from '@chakra-ui/react';
import { SellerGoodsList } from '@project-lc/components-seller/SellerGoodsList';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';
import NextLink from 'next/link';

export function Goods(): JSX.Element {
  return (
    <MypageLayout>
      <Box m={[2, 4]}>
        <NextLink href="/mypage/goods/regist" passHref>
          <Link href="/mypage/goods/regist">
            <Button size="sm" colorScheme="blue" leftIcon={<AddIcon />}>
              상품 등록
            </Button>
          </Link>
        </NextLink>

        <Box mt={4}>
          <SellerGoodsList />
        </Box>
      </Box>
    </MypageLayout>
  );
}

export default Goods;
