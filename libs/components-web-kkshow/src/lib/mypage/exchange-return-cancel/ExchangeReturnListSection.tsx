import {
  Center,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';
import { ExchangeReturnCancelType } from '@project-lc/shared-types';
import CustomerExchangeList from './list/CustomerExchangeList';
import CustomerOrderCancelList from './list/CustomerOrderCancelList';
import CustomerReturnList from './list/CustomerReturnList';
import { DesktopExchangeReturnCancelListHeader } from './list/ExchangeReturnCancelListItem';

type TabData = { key: ExchangeReturnCancelType; text: string };
const tabs: TabData[] = [
  { key: 'cancel', text: '주문취소' },
  { key: 'return', text: '환불' },
  { key: 'exchange', text: '재배송' },
];
/** 소비자의 재배송/환불 목록 표시 컴포넌트 */
export function ExchangeReturnListSection(): JSX.Element {
  const { data: profileData, isLoading } = useProfile();
  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }
  if (!profileData) return <Text>로그인이 필요합니다</Text>;
  return (
    <Tabs>
      <TabList>
        {tabs.map((t) => (
          <Tab key={t.key}>{t.text}</Tab>
        ))}
      </TabList>
      <Stack mt={4} display={{ base: 'none', md: 'block' }}>
        <DesktopExchangeReturnCancelListHeader />
      </Stack>
      <TabPanels>
        <TabPanel>
          <CustomerOrderCancelList customerId={profileData.id} />
        </TabPanel>
        <TabPanel>
          <CustomerReturnList customerId={profileData.id} />
        </TabPanel>
        <TabPanel>
          <CustomerExchangeList customerId={profileData.id} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default ExchangeReturnListSection;
