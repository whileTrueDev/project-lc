import { Spinner, Stack, Text } from '@chakra-ui/react';
import { useKkshowEventPopup } from '@project-lc/hooks';
import AddEventPopupSection from './AddEventPopupSection';

export function AdminEventPopupListContainer(): JSX.Element {
  return (
    <Stack>
      <AddEventPopupSection />
      <Text>이벤트팝업 목록 </Text>
      <EventPopupList />
    </Stack>
  );
}

export function EventPopupList(): JSX.Element {
  const { data: list, isLoading } = useKkshowEventPopup();
  if (isLoading) return <Spinner />;

  if (!list || !list.length) return <Text>등록된 이벤트팝업이 없습니다</Text>;
  return (
    <Stack>
      {list.map((item) => (
        <Stack key={item.id}>
          <Text>
            {item.name} {item.key}
          </Text>
        </Stack>
      ))}
    </Stack>
  );
}
