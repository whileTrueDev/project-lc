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
import { useCustomerMileage } from '@project-lc/hooks';
import { CustomerCouponHistoryList } from './CustomerCouponHistoryList';
import { CustomerCouponList, useValidCustomerCouponList } from './CustomerCouponList';
import { CustomerMileagenHistoryList } from './CustomerMileageHistory';

export function Benefits(): JSX.Element {
  const { validCoupons } = useValidCustomerCouponList();
  const { data: mileage } = useCustomerMileage();

  return (
    <Grid templateColumns="repeat(2, 2fr)" mt={5} gap={2}>
      <GridItem mb={5}>
        <Flex justifyContent="space-between">
          <Text>사용 가능한 쿠폰 수</Text>
          <Flex>
            <Text fontWeight="bold">{validCoupons.length} 장</Text>
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
            <Tab fontSize={{ base: 'sm', sm: 'md' }}>사용 가능한 쿠폰목록</Tab>
            <Tab fontSize={{ base: 'sm', sm: 'md' }}>쿠폰 변동 내역</Tab>
            <Tab fontSize={{ base: 'sm', sm: 'md' }}>마일리지 변동 내역</Tab>
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
