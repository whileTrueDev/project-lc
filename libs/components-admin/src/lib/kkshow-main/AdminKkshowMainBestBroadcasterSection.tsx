import {
  Stack,
  Text,
  Button,
  useDisclosure,
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { KkshowMainBestBroadcasterItem } from '@project-lc/shared-types';
import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { BroadcasterProfile } from './AdminKkshowMainCarouselItemView';
import { AdminKkshowMainFieldArrayItemContainer } from './AdminKkshowMainCarouselSection';

export function AdminKkshowMainBestBroadcasterSection(): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { control } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'bestBroadcaster' as const,
  });

  const itemRemoveHandler = async (
    field: Record<'id', string>,
    index: number,
  ): Promise<void> => {
    remove(index);
  };
  return (
    <Stack>
      <Stack direction="row" alignItems="center">
        <Text fontWeight="bold" size="lg">
          베스트 방송인 영역
        </Text>
        <Stack direction="row">
          <Button onClick={onOpen}>베스트 방송인 추가하기</Button>
          <KkshowMainBestBroadcasterItemDialog
            isOpen={isOpen}
            onClose={onClose}
            createCallback={(item) => append(item)}
          />
        </Stack>
      </Stack>

      <Stack px={4} direction="row">
        {fields.map((field, index) => {
          const item = field as unknown as KkshowMainBestBroadcasterItem;
          return (
            <Stack key={field.id}>
              <AdminKkshowMainFieldArrayItemContainer
                moveUp={() => {
                  if (index > 0) move(index, index - 1);
                }}
                moveDown={() => {
                  if (index < fields.length - 1) move(index, index + 1);
                }}
                removeHandler={() => itemRemoveHandler(field, index)}
              >
                <AdminKkshowMainBestBroadcasterItem item={item} />
              </AdminKkshowMainFieldArrayItemContainer>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}

export default AdminKkshowMainBestBroadcasterSection;

export function KkshowMainBestBroadcasterItemDialog({
  isOpen,
  onClose,
  createCallback,
}: {
  isOpen: boolean;
  onClose: () => void;
  createCallback: (data: KkshowMainBestBroadcasterItem) => void;
}): JSX.Element {
  const [selectedBroadcaster, setSelectedBroadcaster] = useState<any | null>(null);
  const handleCreate = (): void => {
    if (!selectedBroadcaster) return;
    createCallback({
      profileImageUrl: selectedBroadcaster.avatar || '',
      nickname: selectedBroadcaster.userNickname || '',
      broadcasterId: selectedBroadcaster.id,
    });
    setSelectedBroadcaster(null);
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>베스트 방송인 추가하기</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack>
            <Box>
              <Text>방송인 선택</Text>
            </Box>

            <Box>
              <Text>선택한 방송인 정보</Text>
              {selectedBroadcaster ? (
                <Stack direction="row">
                  <Text>선택된 데이터 있음</Text>
                </Stack>
              ) : (
                <Text>선택된 데이터 없음</Text>
              )}
            </Box>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleCreate}
            disabled={!selectedBroadcaster}
          >
            추가
          </Button>
          <Button variant="ghost" onClick={onClose}>
            닫기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export function AdminKkshowMainBestBroadcasterItem({
  item,
}: {
  item: KkshowMainBestBroadcasterItem;
}): JSX.Element {
  return (
    <Stack alignItems="center">
      <BroadcasterProfile profileImageUrl={item.profileImageUrl} />
      <Text>{item.nickname}</Text>
    </Stack>
  );
}
