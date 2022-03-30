import {
  Button,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export interface PageManagerTabsProps {
  title: string;
  subtitle: string;
  tabs: { title: string; component: JSX.Element }[];
  formProps: {
    reset: () => void;
    isResetButtonDisabled?: boolean;
  };
}
export function PageManagerTabs({
  title,
  subtitle,
  tabs,
  formProps: { reset, isResetButtonDisabled },
}: PageManagerTabsProps): JSX.Element {
  const { formState } = useFormContext();
  const [tabIndex, setTabIndex] = useState<number>(0);
  const handleTabChange = (index: number): void => {
    setTabIndex(index);
  };

  const saveButton = useMemo(() => {
    return (
      <Stack>
        <Button
          width="100%"
          type="submit"
          colorScheme={formState.isDirty ? 'red' : 'blue'}
        >
          저장
        </Button>
        {formState.isDirty && (
          <Text as="span" color="red">
            데이터 변경사항이 있습니다. 저장버튼을 눌러주세요!!!!
          </Text>
        )}
      </Stack>
    );
  }, [formState.isDirty]);

  return (
    <Stack minWidth="6xl" w="100%">
      <Text fontWeight="bold">{title}</Text>
      <Text>{subtitle}</Text>
      {saveButton}
      <Button isDisabled={isResetButtonDisabled} onClick={reset}>
        저장하지 않은 수정사항 모두 되돌리기
      </Button>

      <Tabs index={tabIndex} onChange={handleTabChange}>
        <TabList>
          {tabs.map((tab) => (
            <Tab key={tab.title}>{tab.title}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {tabs.map((tab) => (
            <TabPanel key={tab.title}>{tab.component}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      {saveButton}
    </Stack>
  );
}

export default PageManagerTabs;
