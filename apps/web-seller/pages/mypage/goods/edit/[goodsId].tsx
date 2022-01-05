import { Container, Heading } from '@chakra-ui/react';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';
import { GoodsEditForm } from '@project-lc/components-seller/GoodsEditForm';
import { useGoodsById } from '@project-lc/hooks';
import { useRouter } from 'next/router';

export function GoodsEdit(): JSX.Element {
  const router = useRouter();
  const goodsId = router.query.goodsId as string;
  const goods = useGoodsById(goodsId);
  if (goods.isLoading) return <MypageLayout>...loading</MypageLayout>;

  if (!goods.isLoading && !goods.data) return <MypageLayout>...no data</MypageLayout>;

  return (
    <MypageLayout>
      <Container maxWidth="container.xl" my={12}>
        <Heading>상품수정</Heading>
        <GoodsEditForm goodsData={goods.data} />
      </Container>
    </MypageLayout>
  );
}

export default GoodsEdit;
