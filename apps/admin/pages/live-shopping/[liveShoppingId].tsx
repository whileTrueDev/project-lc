import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Stack } from '@chakra-ui/react';
import {
  AdminPageLayout,
  LiveShoppingDetailTitle,
  BroadcasterAutocomplete,
  LiveShoppingProgressSelector,
} from '@project-lc/components';
import { useAdminLiveShoppingList, useProfile, useBroadcaster } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import React from 'react';

export function GoodsDetail(): JSX.Element {
  const router = useRouter();
  const liveShoppingId = router.query.liveShoppingId as string;
  const { data: profileData } = useProfile();
  const { data, isLoading } = useAdminLiveShoppingList({
    enabled: !!profileData?.email,
    id: liveShoppingId,
  });

  const { data: broadcaster } = useBroadcaster();
  console.log(data);
  console.log(broadcaster);
  // if (goods.isLoading) return <AdminPageLayout>...loading</AdminPageLayout>;

  // if (!goods.isLoading && !goods.data)
  //   return <AdminPageLayout>...no data</AdminPageLayout>;

  /**
  - **신청됨**: 신청 직후의 상태
  - **조율중**: 신청을 확인, 라이브 진행 방송인 선정부터 일정 등을 조율하고 있는 상태
  - **확정됨**: 라이브 진행할 방송인 선정완료, 일정 수립 완료된 상태
  - **라이브진행중**: 현재 라이브 방송 진행중인 상태. (→ 입력된 방송 시간에 따라 자동으로 렌더링 변경)
  - **라이브진행완료**: 라이브 방송 진행이 완료된 상태. (→ 입력된 방송 시간 자동으로 렌더링 변경)
  - **판매완료**: 라이브 방송 이후 판매까지 완료된 상태 (→ 판매 시간에 따라 자동으로 렌더링 변경)
  - [기획오류. 진행안함]**~~부분정산완료**: 이 라이브를 통해 진행한 주문 중 일부가 정산된 상태~~
  - [기획오류. 진행안함]**~~정산완료**: 이 라이브를 통해 진행한 주문이 모두 정산된 상태~~
  - **취소됨**: 라이브 진행이 취소됨 (사유 필요)
 */

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
        {data && !isLoading && <LiveShoppingDetailTitle liveShopping={data[0]} />}
        <LiveShoppingProgressSelector />
        <BroadcasterAutocomplete data={broadcaster} />
      </Stack>
    </AdminPageLayout>
  );
}

export default GoodsDetail;
