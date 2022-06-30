import {
  Flex,
  Grid,
  GridItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useCustomerCouponList, useCustomerMileage } from '@project-lc/hooks';
import { CustomerCouponHistoryList } from './CustomerCouponHistoryList';
import { CustomerCouponList } from './CustomerCouponList';
import { CustomerMileagenHistoryList } from './CustomerMileageHistory';

export function Benefits(): JSX.Element {
  const { data: coupons } = useCustomerCouponList();
  const { data: mileage } = useCustomerMileage();
  const couponLength = coupons?.length;
  return (
    <Grid templateColumns="repeat(2, 2fr)" mt={5} gap={2}>
      <GridItem mb={5}>
        <Flex justifyContent="space-between">
          <Text>보유쿠폰 수</Text>
          <Flex>
            <Text fontWeight="bold">{couponLength} 장</Text>
          </Flex>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>보유 마일리지</Text>
          <Text fontWeight="bold">{mileage?.mileage?.toLocaleString() || 0} 원</Text>
        </Flex>
      </GridItem>

      <GridItem colSpan={2}>
        <Tabs>
          <TabList>
            <Tab fontSize={{ base: 'sm', sm: 'md' }}>보유 쿠폰목록</Tab>
            <Tab fontSize={{ base: 'sm', sm: 'md' }}>쿠폰 사용내역</Tab>
            <Tab fontSize={{ base: 'sm', sm: 'md' }}>마일리지 사용내역</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <CustomerCouponList />
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
  );
}

export default Benefits;
