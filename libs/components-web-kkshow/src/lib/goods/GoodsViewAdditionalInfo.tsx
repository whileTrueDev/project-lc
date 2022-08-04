import { Box, Text } from '@chakra-ui/react';
import { useGoodsById } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { GoodsDefaultCommonInfoText } from '@project-lc/components-shared/goods/GoodsDefaultCommonInfoText';

export function GoodsViewAdditionalInfo(): JSX.Element | null {
  const router = useRouter();
  const goodsId = router.query.goodsId as string;
  const goods = useGoodsById(goodsId);

  if (!goods.data) return null;
  return (
    <Box maxW="5xl" m="auto" id="goods-info" minH="50vh" p={2} pt={20}>
      <Text fontSize="2xl">교환/반품/배송정보</Text>
      {goods.data.GoodsInfo ? (
        <>
          <Text>{goods.data.GoodsInfo.info_name}</Text>
          <Box dangerouslySetInnerHTML={{ __html: goods.data.GoodsInfo.info_value }} />
        </>
      ) : (
        // 상품공통정보 없는경우(= 등록하지 않은 경우) 기본상품공통정보 표시
        <GoodsDefaultCommonInfoText />
      )}
    </Box>
  );
}
