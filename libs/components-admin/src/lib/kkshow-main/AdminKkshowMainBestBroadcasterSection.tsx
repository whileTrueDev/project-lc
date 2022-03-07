import { Box, Button, Input, Stack, Text } from '@chakra-ui/react';
import { ChakraAutoComplete } from '@project-lc/components-core/ChakraAutoComplete';
import { useAdminBroadcaster } from '@project-lc/hooks';
import {
  BroadcasterDTO,
  KkshowMainBestBroadcasterItem,
  KkshowMainResData,
} from '@project-lc/shared-types';
import { FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form';
import { BroadcasterProfile } from './AdminKkshowMainCarouselItemView';
import { AdminKkshowMainFieldArrayItemContainer } from './AdminKkshowMainCarouselSection';

export function AdminKkshowMainBestBroadcasterSection(): JSX.Element {
  const { control } = useFormContext<KkshowMainResData>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'bestBroadcaster' as const,
  });

  const appendItem = (): void => {
    append({
      profileImageUrl: '',
      nickname: '',
      broadcasterId: null,
    });
  };

  const itemRemoveHandler = async (
    field: FieldArrayWithId<KkshowMainResData, 'bestBroadcaster', 'id'>,
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
          <Button onClick={appendItem}>베스트 방송인 추가하기</Button>
        </Stack>
      </Stack>

      <Stack px={4}>
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
                <AdminKkshowMainBestBroadcasterItem index={index} item={item} />
              </AdminKkshowMainFieldArrayItemContainer>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}

export default AdminKkshowMainBestBroadcasterSection;

export function AdminKkshowMainBestBroadcasterItem({
  item,
  index,
}: {
  item: KkshowMainBestBroadcasterItem;
  index: number;
}): JSX.Element {
  const { register, setValue, watch } = useFormContext();
  const profileImageUrl = watch(`bestBroadcaster.${index}.profileImageUrl`);

  const { data } = useAdminBroadcaster();

  const onBroadcasterSelectChange = (
    selectedBroadcaster: BroadcasterDTO | null,
  ): void => {
    if (selectedBroadcaster) {
      setValue(
        `bestBroadcaster.${index}.profileImageUrl`,
        selectedBroadcaster.avatar || '',
        { shouldDirty: true },
      );
      setValue(
        `bestBroadcaster.${index}.nickname`,
        selectedBroadcaster.userNickname || '',
        { shouldDirty: true },
      );
      setValue(`bestBroadcaster.${index}.broadcasterId`, selectedBroadcaster.id, {
        shouldDirty: true,
      });
    }
  };

  return (
    <Stack direction="row" alignItems="center">
      <Text>순서 : {index + 1}</Text>
      <BroadcasterProfile profileImageUrl={profileImageUrl} />
      <Box>
        <Text>방송인 이미지 주소</Text>
        <Input {...register(`bestBroadcaster.${index}.profileImageUrl` as const)} />
      </Box>
      <Box>
        <Text>활동명</Text>
        <Input {...register(`bestBroadcaster.${index}.nickname` as const)} />
      </Box>
      <Box>
        <Text>방송인 선택</Text>
        <ChakraAutoComplete
          options={data || []}
          getOptionLabel={(option) => option?.userNickname || ''}
          onChange={onBroadcasterSelectChange}
        />
      </Box>
    </Stack>
  );
}
