import { Box, Text } from '@chakra-ui/react';
import {
  AdminGiftList,
  SeletctedLiveShoppingType,
} from '@project-lc/components-admin/AdminGiftList';
import { AdminLiveShoppingList } from '@project-lc/components-admin/AdminLiveShoppingList';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';

import { useState } from 'react';

export default function LiveShopping(): JSX.Element {
  const [selectedGoods, setSelectedGoods] = useState<SeletctedLiveShoppingType>({
    goodsId: 0,
  });

  const [selectedLiveShoppingId, setSelectedLiveShoppingId] = useState<null | number>(
    null,
  );

  return (
    <AdminPageLayout>
      <Box>selectedLiveShoppingId : {JSON.stringify(selectedLiveShoppingId)}</Box>
      {/* 라이브쇼핑 목록 */}
      <AdminLiveShoppingList
        setSelectedGoods={setSelectedGoods}
        onRowClick={(liveShoppingId) => setSelectedLiveShoppingId(liveShoppingId)}
      />
      {/* 라이브 쇼핑의 선물하기 목록 */}
      <Box borderWidth="1px" borderRadius="lg" p={7} m={7}>
        <Text fontSize="lg" fontWeight="medium" pb={1}>
          라이브 쇼핑 선물 리스트
        </Text>
        <AdminGiftList
          selectedGoods={selectedGoods}
          selectedLiveShoppingId={selectedLiveShoppingId}
        />
      </Box>
    </AdminPageLayout>
  );
}
