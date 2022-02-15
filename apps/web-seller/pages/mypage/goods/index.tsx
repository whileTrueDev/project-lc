import { AddIcon } from '@chakra-ui/icons';
import { Box, Button } from '@chakra-ui/react';
import { SellerGoodsList } from '@project-lc/components-seller/SellerGoodsList';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';
import { useRouter } from 'next/router';

export function Goods(): JSX.Element {
  const router = useRouter();
  return (
    <MypageLayout>
      <Box m={[2, 4]}>
        <Button
          size="sm"
          colorScheme="blue"
          leftIcon={<AddIcon />}
          onClick={() => router.push('/mypage/goods/regist')}
        >
          상품 등록
        </Button>

        <Box mt={4}>
          <SellerGoodsList />
        </Box>
      </Box>
    </MypageLayout>
  );
}

export default Goods;
