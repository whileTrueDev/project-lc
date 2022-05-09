/* eslint-disable react/no-array-index-key */
import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import ReviewList from '@project-lc/components-web-kkshow/review/ReviewList';
import { ReviewPolicy } from '@project-lc/components-web-kkshow/review/ReviewPolicy';
import { useProfile } from '@project-lc/hooks';

export function ReviewIndex(): JSX.Element {
  const tabInfos = [
    { title: '리뷰 관리', component: <MyReviewList /> },
    { title: '리뷰 등록', component: <ReviewCreateList /> },
  ];

  return (
    <CustomerMypageLayout>
      <Box p={4}>
        <Heading>리뷰 관리</Heading>

        <Box mt={6}>
          <ReviewPolicy defaultOpen />
        </Box>

        <Box mt={6}>
          <Tabs>
            <TabList>
              {tabInfos.map((tab) => (
                <Tab key={tab.title}>{tab.title}</Tab>
              ))}
            </TabList>

            <TabPanels>
              {tabInfos.map((tab) => (
                <TabPanel key={tab.title} px={0}>
                  {tab.component}
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </CustomerMypageLayout>
  );
}

export default ReviewIndex;

function ReviewCreateList(): JSX.Element {
  return (
    <Box>
      <Text>리뷰 생성 목록</Text>
    </Box>
  );
}

function MyReviewList(): JSX.Element {
  const profile = useProfile();
  return (
    <>
      <ReviewList
        dto={{ customerId: profile.data?.id, skip: 0, take: 5 }}
        enabled={!!profile.data?.id}
        defaultFolded
        editable
        removable
      />
    </>
  );
}
