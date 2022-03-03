import { Button, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { KkshowMainCarouselItem } from '@project-lc/shared-types';
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { AdminKkshowMainCarouselItemView } from './AdminKkshowMainCarouselItemView';
import { KkshowMainCarouselItemDialog } from './KkshowMainCarouselItemDialog';

export function AdminKkshowMainCarouselSection(): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { control, register } = useFormContext();
  const { fields, append, remove, swap, move, insert } = useFieldArray({
    control,
    name: 'carousel' as const,
  });

  const itemRemoveHandler = async (
    field: Record<'id', string>,
    index: number,
  ): Promise<void> => {
    // const item = { ...field } as unknown as KkshowMainCarouselItem;
    // if (item.type === 'simpleBanner') {
    // TODO: 키 조회 필요
    // await s3.s3DeleteImages([item.imageUrl]);
    // }
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
}: {
  children: React.ReactNode;
  removeHandler?: () => void;
}): JSX.Element {
  return (
    <Stack direction="row" border="1px" w="100%" p={1} alignItems="center" mb={1}>
      {children}
      <Button onClick={removeHandler}>delete</Button>
    </Stack>
  );
}
