import { Button, Stack } from '@chakra-ui/react';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';
import { SellerGoodsList } from '@project-lc/components/SellerGoodsList';
import Link from 'next/link';

export function Goods(): JSX.Element {
  return (
    <MypageLayout>
      <Stack direction="row" p={2} justifyContent="flex-end">
        <Link href="/mypage/goods/regist" passHref>
          <Button colorScheme="blue">상품등록</Button>
        </Link>
      </Stack>
      <SellerGoodsList />
    </MypageLayout>
  );
}

export default Goods;
