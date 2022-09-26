import { Avatar, Divider, Spinner, Stack, Text } from '@chakra-ui/react';
import { useKkshowEventPopup } from '@project-lc/hooks';
import AddEventPopupSection, { pathNames } from './AddEventPopupSection';

export function AdminEventPopupListContainer(): JSX.Element {
  return (
    <Stack>
      <AddEventPopupSection />
      <Text>등록된 이벤트팝업 목록 </Text>
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
        <Stack key={item.id} direction="row" alignItems="center">
          <Avatar src={item.imageUrl} borderRadius="base" />
          <Stack>
            <Divider />
            <Text>우선순위 : {item.priority}</Text>
            <Text>
              팝업명 : {item.name}, 식별값 : {item.key}
            </Text>
            <Text>
              표시되는 페이지 :{' '}
              {JSON.parse(JSON.stringify(item.displayPath))
                .map((path: string) => {
                  return pathNames[path];
                })
                .join(', ')}
            </Text>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
