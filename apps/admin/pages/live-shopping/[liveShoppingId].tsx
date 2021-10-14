import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Stack } from '@chakra-ui/react';
import { AdminPageLayout } from '@project-lc/components';
import { useAdminLiveShoppingList, useProfile } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import React from 'react';

export function GoodsDetail(): JSX.Element {
  const router = useRouter();
  const liveShoppingId = router.query.liveshoppingId as string;

  // const goods = useAdminGoodsById(liveshoppingId);

  // if (goods.isLoading) return <AdminPageLayout>...loading</AdminPageLayout>;

  // if (!goods.isLoading && !goods.data)
  //   return <AdminPageLayout>...no data</AdminPageLayout>;

  return (
    <AdminPageLayout>
      <Stack m="auto" maxW="4xl" mt={{ base: 2, md: 8 }} spacing={8} p={2} mb={16}>
        <Box as="section">
          <Flex direction="row" alignItems="center" justifyContent="space-between">
            <Button
              size="sm"
              leftIcon={<ChevronLeftIcon />}
              onClick={() => router.push('/goods')}
            >
              목록으로
            </Button>
            {/* 상품 검수를 위한 버튼 */}
          </Flex>
        </Box>
        {/* 상품 제목 */}
        Hello
        {liveShoppingId}
      </Stack>
    </AdminPageLayout>
  );
}

export default GoodsDetail;
