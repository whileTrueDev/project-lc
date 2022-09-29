import { DeleteIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Divider,
  IconButton,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
  Link,
} from '@chakra-ui/react';
import { KkshowEventPopup } from '@prisma/client';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { useAdminDeleteEventPopupMutation, useKkshowEventPopup } from '@project-lc/hooks';
import { s3 } from '@project-lc/utils-s3';
import { useState } from 'react';
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

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPopupId, setSelectedPopupId] = useState<number | null>(null);
  const { mutateAsync } = useAdminDeleteEventPopupMutation();
  const deletePopup = async (): Promise<void> => {
    if (!selectedPopupId || !list) return;
    const target = list.find((item) => item.id === selectedPopupId);
    if (!target) return;

    // db에서 eventpopup 데이터 삭제
    try {
      await mutateAsync({ id: selectedPopupId });
      toast({ title: '삭제 성공', status: 'success' });
    } catch (e) {
      console.error(e);
      toast({ title: '삭제 오류', status: 'error' });
    }

    // s3에서 이미지파일 삭제 - 리턴값 필요없으므로 await 안씀
    try {
      s3.sendDeleteObjectsCommand({
        deleteObjects: [{ Key: target.imageUrl }],
      });
    } catch (s3Error) {
      console.error(s3Error);
    }

    onClose();
  };
  if (isLoading) return <Spinner />;

  if (!list || !list.length) return <Text>등록된 이벤트팝업이 없습니다</Text>;
  return (
    <Stack>
      {list.map((item) => (
        <EventPopupDisplayItem
          key={item.id}
          item={item}
          onButtonClick={() => {
            onOpen();
            setSelectedPopupId(item.id);
          }}
        />
      ))}
      <ConfirmDialog
        isOpen={isOpen}
        title="이벤트 팝업을 삭제하시겠습니까"
        onClose={() => {
          onClose();
          setSelectedPopupId(null);
        }}
        onConfirm={deletePopup}
      >
        선택하신 팝업을 삭제하시겠습니까? id: {selectedPopupId}
      </ConfirmDialog>
    </Stack>
  );
}

function EventPopupDisplayItem({
  item,
  onButtonClick,
}: {
  item: KkshowEventPopup;
  onButtonClick: () => void;
}): JSX.Element {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton
        aria-label="delete popup"
        icon={<DeleteIcon />}
        size="sm"
        onClick={onButtonClick}
      />
      <Avatar src={s3.getSavedObjectUrl(item.imageUrl)} borderRadius="base" size="lg" />
      <Stack>
        <Divider />
        <Text>우선순위 : {item.priority}</Text>
        <Text>
          팝업명 : {item.name}, id : {item.id}, key : {item.key}
        </Text>
        <Text>
          표시되는 페이지 :{' '}
          {JSON.parse(JSON.stringify(item.displayPath))
            .map((path: string) => {
              return pathNames[path];
            })
            .join(', ')}
        </Text>
        {item.linkUrl && (
          <Text>
            연결링크 :{' '}
            <Link href={item.linkUrl} isExternal={item.linkUrl.startsWith('http')}>
              {item.linkUrl}
            </Link>
          </Text>
        )}
      </Stack>
    </Stack>
  );
}
