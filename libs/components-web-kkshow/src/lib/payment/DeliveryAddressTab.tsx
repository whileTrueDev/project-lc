import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

export function DeliveryAddressTab(): JSX.Element {
  return (
    <Tabs>
      <TabList>
        <Tab>기본 배송지</Tab>
        <Tab>Two</Tab>
        <Tab>Three</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <p>one!</p>
        </TabPanel>
        <TabPanel>
          <p>two!</p>
        </TabPanel>
        <TabPanel>
          <p>three!</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
