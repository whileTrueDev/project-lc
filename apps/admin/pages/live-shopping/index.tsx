import { Box, Text, Link, Button } from '@chakra-ui/react';
import { AdminGiftList } from '@project-lc/components-admin/AdminGiftList';
import { AdminLiveShoppingList } from '@project-lc/components-admin/AdminLiveShoppingList';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import NextLink from 'next/link';

import { useState } from 'react';

export default function LiveShopping(): JSX.Element {
  const [selectedLiveShoppingId, setSelectedLiveShoppingId] = useState<null | number>(
    null,
  );

  return (
    <AdminPageLayout>
      <NextLink passHref href="/live-shopping/create">
        <Link color="blue.500" fontSize="sm" as={Button}>
          관리자로 라이브쇼핑 생성하기
        </Link>
      </NextLink>
      {/* 라이브쇼핑 목록 */}
      <AdminLiveShoppingList
        onRowClick={(liveShoppingId) => setSelectedLiveShoppingId(liveShoppingId)}
      />
      {/* 라이브 쇼핑의 선물하기 목록 */}
      <Box borderWidth="1px" borderRadius="lg" p={7} m={7}>
        <Text fontSize="lg" fontWeight="medium" pb={1}>
          라이브 쇼핑 선물 리스트
        </Text>
        <AdminGiftList selectedLiveShoppingId={selectedLiveShoppingId} />
      </Box>
    </AdminPageLayout>
  );
}
