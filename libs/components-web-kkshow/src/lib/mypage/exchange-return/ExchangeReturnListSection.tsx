import { Button, Center, Spinner, Stack, Text } from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';
import { useState } from 'react';
import CustomerExchangeList from './list/CustomerExchangeList';
import CustomerOrderCancelList from './list/CustomerOrderCancelList';
import CustomerReturnList from './list/CustomerReturnList';
import {
  DesktopExchangeReturnCancelListHeader,
  ExchangeReturnCancelType,
} from './list/ExchangeReturnCancelListItem';

type Tab = { key: ExchangeReturnCancelType; text: string };
const tabs: Tab[] = [
  { key: 'cancel', text: '주문취소' },
  { key: 'return', text: '환불' },
  { key: 'exchange', text: '재배송' },
];
/** 소비자의 재배송/환불 목록 표시 컴포넌트 */
export function ExchangeReturnListSection(): JSX.Element {
  const { data: profileData, isLoading } = useProfile();
  const [currentTab, setCurrentTab] = useState<Tab>(tabs[0]);
  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }
  if (!profileData) return <Text>로그인이 필요합니다</Text>;
  return (
    <Stack>
      <Stack direction="row">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            size="sm"
            variant="outline"
            color={currentTab.key === tab.key ? 'blue.500' : undefined}
            onClick={() => setCurrentTab(tab)}
          >
            {tab.text}
          </Button>
        ))}
      </Stack>
      <Stack display={{ base: 'none', md: 'block' }}>
        <DesktopExchangeReturnCancelListHeader />
      </Stack>

      {currentTab.key === 'cancel' && (
        <CustomerOrderCancelList customerId={profileData.id} />
      )}

      {currentTab.key === 'return' && <CustomerReturnList customerId={profileData.id} />}

      {currentTab.key === 'exchange' && (
        <CustomerExchangeList customerId={profileData.id} />
      )}
    </Stack>
  );
}

export default ExchangeReturnListSection;
