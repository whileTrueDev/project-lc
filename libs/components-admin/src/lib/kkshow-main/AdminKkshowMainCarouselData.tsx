import { Button, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { KkshowMainCarouselItem } from '@project-lc/shared-types';
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { AdminKkshowMainCarouselItemView } from './AdminKkshowMainCarouselItemView';
import { KkshowMainCarouselItemDialog } from './KkshowMainCarouselItemDialog';

export function AdminKkshowMainCarouselSection(): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { control } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'carousel' as const,
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
          캐러셀 영역
        </Text>
        <Stack direction="row">
          <Button onClick={onOpen}>캐러셀 아이템 추가하기</Button>
          <KkshowMainCarouselItemDialog
            isOpen={isOpen}
            onClose={onClose}
            createCallback={(itemData) => {
              append(itemData);
            }}
          />
        </Stack>
      </Stack>

      <Stack>
        {fields.map((field, index) => {
          return (
            <Stack key={field.id} w="100%" maxH="200px">
              <AdminKkshowMainCarouselItemBoxLayout
                moveUp={() => {
                  if (index > 0) move(index, index - 1);
                }}
                moveDown={() => {
                  if (index < fields.length - 1) move(index, index + 1);
                }}
                removeHandler={() => itemRemoveHandler(field, index)}
              >
                <AdminKkshowMainCarouselItemView
                  index={index}
                  item={field as unknown as KkshowMainCarouselItem}
                />
              </AdminKkshowMainCarouselItemBoxLayout>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}

export default AdminKkshowMainCarouselSection;

export function AdminKkshowMainCarouselItemBoxLayout({
  children,
  removeHandler,
  moveUp,
  moveDown,
}: {
  children: React.ReactNode;
  removeHandler?: () => void;
  moveUp?: () => void;
  moveDown?: () => void;
}): JSX.Element {
  return (
    <Stack
      direction="row"
      border="1px"
      w="100%"
      p={1}
      alignItems="center"
      mb={1}
      justifyContent="space-between"
    >
      <Stack direction="row">{children}</Stack>

      <Stack>
        <Button onClick={moveUp}>위로</Button>
        <Button onClick={moveDown}>아래로</Button>
        <Button onClick={removeHandler}>delete</Button>
      </Stack>
    </Stack>
  );
}
