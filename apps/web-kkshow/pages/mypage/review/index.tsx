/* eslint-disable react/no-array-index-key */
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import ReviewCreateList from '@project-lc/components-shared/goods-review/ReviewCreateList';
import ReviewList from '@project-lc/components-shared/goods-review/ReviewList';
import { ReviewPolicy } from '@project-lc/components-shared/goods-review/ReviewPolicy';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import { useOrderItemReviewNeeded, useProfile } from '@project-lc/hooks';
import { useMemo } from 'react';

export function ReviewIndex(): JSX.Element {
  const title = '상품 후기 관리';
  const profile = useProfile();
  const orderItem = useOrderItemReviewNeeded(profile.data?.id);

  const tabInfos = useMemo(
    () => [
      {
        title: '내 후기 관리',
        component: (
          <ReviewList
            dto={{ customerId: profile.data?.id, skip: 0, take: 5 }}
            enabled={!!profile.data?.id}
            defaultFolded
            editable
            removable
            includeGoodsInfo
          />
        ),
      },
      {
        title: `후기 작성 ${
          orderItem.data?.length > 0 ? `(${orderItem.data.length})` : ''
        }`,
        component: <ReviewCreateList />,
      },
    ],
    [orderItem.data, profile.data?.id],
  );

  return (
    <CustomerMypageLayout title={title}>
      <Box p={{ base: 2, md: 4 }}>
        {/* 제목 */}
        <Text fontSize="xl" fontWeight="bold">
          {title}
        </Text>

        {/* 리뷰 정책 */}
        <Box>
          <ReviewPolicy defaultOpen />
        </Box>

        {/* 탭 */}
        <Box mt={{ base: 2, md: 6 }}>
          <Tabs>
            <TabList>
              {tabInfos.map((tab) => (
                <Tab key={tab.title}>{tab.title}</Tab>
              ))}
            </TabList>

            <TabPanels>
              {tabInfos.map((tab) => (
                <TabPanel key={tab.title}>{tab.component}</TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </CustomerMypageLayout>
  );
}

export default ReviewIndex;
