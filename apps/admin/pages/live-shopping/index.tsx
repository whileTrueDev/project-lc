import {
  AdminPageLayout,
  AdminLiveShoppingList,
  AdminGiftList,
  SeletctedLiveShoppingType,
} from '@project-lc/components';
import { Box, Text } from '@chakra-ui/react';
import { useState } from 'react';

export default function LiveShopping(): JSX.Element {
  const [selectedGoods, setSelectedGoods] = useState<SeletctedLiveShoppingType>({
    goodsId: 0,
  });

  return (
    <AdminPageLayout>
      {/* 라이브쇼핑 목록 */}
      <AdminLiveShoppingList setSelectedGoods={setSelectedGoods} />
      {/* 라이브 쇼핑의 선물하기 목록 */}
      <Box borderWidth="1px" borderRadius="lg" p={7} m={7}>
        <Text fontSize="lg" fontWeight="medium" pb={1}>
          라이브 쇼핑 선물 리스트
        </Text>
        <AdminGiftList selectedGoods={selectedGoods} />
      </Box>
    </AdminPageLayout>
  );
}
