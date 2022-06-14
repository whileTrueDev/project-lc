import {
  Box,
  Text,
  Flex,
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { useCustomerCouponList, useCustomerMileage } from '@project-lc/hooks';
import { CustomerCouponList } from './CustomerCouponList';
import { CustomerCouponHistoryList } from './CustomerCouponHistoryList';
import { CustomerMileagenHistoryList } from './CustomerMileageHistory';

export function Benefits(): JSX.Element {
  const { data: coupons } = useCustomerCouponList();
  const { data: mileage } = useCustomerMileage();
  const couponLength = coupons?.length;
  return (
    <>
      <Text fontSize="xl" fontWeight="bold">
        혜택관리
      </Text>
      <Grid templateColumns="repeat(2, 2fr)" mt={5} gap={2}>
        <GridItem mb={5}>
          <Box mb={5}>
            <Flex justifyContent="space-between">
              <Text>보유쿠폰 수</Text>
              <Flex>
                <Text fontWeight="bold">{couponLength} 장</Text>
              </Flex>
            </Flex>
          </Box>
          <Box>
            <Flex justifyContent="space-between">
              <Text>보유 마일리지</Text>
              <Text fontWeight="bold">{mileage?.mileage?.toLocaleString() || 0} 원</Text>
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
                <CustomerMileagenHistoryList />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>
    </>
  );
}

export default Benefits;
