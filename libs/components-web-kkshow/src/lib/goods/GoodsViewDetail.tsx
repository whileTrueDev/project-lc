import { Box, useColorModeValue } from '@chakra-ui/react';
import { useGoodsById } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import 'suneditor/dist/css/suneditor.min.css';

export function GoodsViewDetail(): JSX.Element | null {
  const router = useRouter();
  const goodsId = router.query.goodsId as string;
  const goods = useGoodsById(goodsId);

  const bgColor = useColorModeValue('white', 'gray.800');

  if (!goods.data) return null;
  return (
    <Box maxW="5xl" m="auto" id="goods-contents" pt={{ base: 4, md: 20 }}>
      {goods.data.contents && (
        <Box
          className="sun-editor-editable"
          id={`goods-contents-${goods.data.id}`}
          p={0}
          bgColor={bgColor}
          color="inherit"
          dangerouslySetInnerHTML={{ __html: goods.data.contents }}
        />
      )}
    </Box>
  );
}
