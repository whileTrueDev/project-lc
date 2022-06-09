import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import { useProfile, useCustomerCouponList } from '@project-lc/hooks';
import { CustomerCouponList } from '@project-lc/components-web-kkshow/mypage/benefits/CustomerCouponList';
import { CustomerCouponHistoryList } from '@project-lc/components-web-kkshow/mypage/benefits/CustomerCouponHistoryList';

export function Benefits(): JSX.Element {
  const { data: profile } = useProfile();
  const { data: coupons } = useCustomerCouponList();
  const couponLength = coupons?.length;
  console.log(coupons);
  return (
    <CustomerMypageLayout>
      <Heading>나의 혜택관리</Heading>
      <Grid templateColumns="repeat(2, 2fr)" mt={2} gap={2}>
        <GridItem>
          <Box>
            <Flex justifyContent="space-between">
              <Text>보유쿠폰 수</Text>
              <Flex>
                <Text>{couponLength} 장</Text>
              </Flex>
            </Flex>
          </Box>
        </GridItem>
        <GridItem>
          <Box>
            <Flex justifyContent="space-between">
              <Text>보유 마일리지</Text>
              <Text>0 원</Text>
            </Flex>
          </Box>
        </GridItem>
        <GridItem colSpan={2}>
          <Tabs>
            <TabList>
              <Tab>보유 쿠폰목록</Tab>
              <Tab>쿠폰 사용내역</Tab>
              <Tab>마일리지 사용내역</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <CustomerCouponList data={coupons} />
              </TabPanel>
              <TabPanel>
                <CustomerCouponHistoryList />
              </TabPanel>
              <TabPanel>
                <p>three!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>
    </CustomerMypageLayout>
  );
}

export default Benefits;
