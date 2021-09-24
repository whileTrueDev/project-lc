import { MypageLayout, SellerGoodsList } from '@project-lc/components';
import Link from 'next/link';
import { Button } from '@chakra-ui/react';

export function Goods(): JSX.Element {
  return (
    <MypageLayout>
      <Link href="/mypage/goods/regist" passHref>
        <Button>상품등록</Button>
      </Link>
      <SellerGoodsList />
    </MypageLayout>
  );
}

export default Goods;
