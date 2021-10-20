import {
  AdminPageLayout,
  AdminLiveShoppingList,
  AdminGiftList,
} from '@project-lc/components';
import { Box, Text } from '@chakra-ui/react';
import { useState } from 'react';

export default function LiveShopping(): JSX.Element {
  const [goodsId, setGoodsId] = useState<number>(0);

  return (
    <AdminPageLayout>
      <AdminLiveShoppingList setGoodsId={setGoodsId} />
      {/* 라이브 쇼핑의 선물하기 목록 */}
      <Box borderWidth="1px" borderRadius="lg" p={7} m={7}>
        <Text fontSize="lg" fontWeight="medium" pb={1}>
          라이브 쇼핑 선물 리스트
        </Text>
        <AdminGiftList goodsId={goodsId} />
      </Box>
    </AdminPageLayout>
  );
}
