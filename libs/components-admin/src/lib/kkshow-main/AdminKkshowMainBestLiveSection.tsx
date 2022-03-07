import { Box, Button, Input, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { LiveShoppingWithGoods } from '@project-lc/hooks';
import { KkshowMainBestLiveItem } from '@project-lc/shared-types';
import { useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  BroadcasterProfile,
  LoadLiveShoppingDataDialog,
  VideoImbed,
} from './AdminKkshowMainCarouselItemView';
import { AdminKkshowMainFieldArrayItemContainer } from './AdminKkshowMainCarouselSection';

export function AdminKkshowMainBestLiveSection(): JSX.Element {
  const { control } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'bestLive' as const,
  });
  const appendItem = (): void => {
    append({
      videoUrl: '',
      broadcasterProfileImageUrl: '',
      liveShoppingDescription: '',
      liveShoppingTitle: '',
      liveShoppingId: null,
    });
  };
  return (
    <Stack>
      <Stack direction="row" alignItems="center">
        <Text fontWeight="bold" size="lg">
          베스트 라이브 영역
        </Text>
        <Stack>
          <Button onClick={appendItem}>베스트 라이브 아이템 추가하기</Button>
        </Stack>
      </Stack>

      <Stack px={4}>
        {fields.map((field, index) => {
          const item = field as unknown as KkshowMainBestLiveItem;
          return (
            <Stack key={field.id} w="100%" maxH="200px">
              <AdminKkshowMainFieldArrayItemContainer
                moveUp={() => {
                  if (index > 0) move(index, index - 1);
                }}
                moveDown={() => {
                  if (index < fields.length - 1) move(index, index + 1);
                }}
                removeHandler={() => remove(index)}
              >
                <AdminKkshowMainBestLiveItem index={index} item={item} />
              </AdminKkshowMainFieldArrayItemContainer>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}

export default AdminKkshowMainBestLiveSection;

export function AdminKkshowMainBestLiveItem({
  index,
  item,
}: {
  index: number;
  item: KkshowMainBestLiveItem;
}): JSX.Element {
  const { register, watch, setValue } = useFormContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const videoUrl = watch(`bestLive.${index}.videoUrl`);
  const profileImageUrl = watch(`bestLive.${index}.profileImageUrl`);
  const liveShoppingId = watch(`bestLive.${index}.liveShoppingId`);
  const embedUrl = useMemo(() => {
    if (!videoUrl) {
      return '';
    }
    return `https://www.youtube.com/embed/${videoUrl.replace('https://youtu.be/', '')}`;
  }, [videoUrl]);

  const setItemValue = (data: LiveShoppingWithGoods): void => {
    setValue(`bestLive.${index}.liveShoppingId`, data.id, { shouldDirty: true });
    setValue(`bestLive.${index}.videoUrl`, data.liveShoppingVideo?.youtubeUrl || '');
    setValue(`bestLive.${index}.profileImageUrl`, data.broadcaster.avatar || '');
    setValue(
      `bestLive.${index}.liveShoppingDescription`,
      `${data.broadcaster.userNickname} x ${data.seller.sellerShop.shopName}`,
    );
    setValue(`bestLive.${index}.liveShoppingTitle`, data.liveShoppingName || '');
  };
  return (
    <Stack direction="row">
      <Stack>
        <Text>순위</Text>
        <Text>{index + 1}</Text>
      </Stack>

      <Box>
        {embedUrl && <VideoImbed videoUrl={embedUrl} />}
        {!embedUrl && !liveShoppingId && (
          <Box>
            <Text>
              유튜브 영상 주소 ( https://youtu.be/4pIuCJTMXQU ) 같은 형태로 입력
            </Text>
            <Input {...register(`bestLive.${index}.videoUrl` as const)} />
          </Box>
        )}
        {!embedUrl && liveShoppingId && (
          <Text>
            등록된 유튜브 영상이 없습니다.
            <br />
            라이브 쇼핑 목록에서 유튜브 영상 주소를 저장한 후
            <br />
            다시 정보를 가져와주세요
          </Text>
        )}
      </Box>

      <Stack>
        <BroadcasterProfile profileImageUrl={profileImageUrl} />
        <Text>방송인 이미지 주소</Text>
        <Input {...register(`bestLive.${index}.profileImageUrl`)} />
      </Stack>

      <Stack>
        <Text>방송인 x 상점명</Text>
        <Input {...register(`bestLive.${index}.liveShoppingDescription`)} />
        <Text>방송명</Text>
        <Input {...register(`bestLive.${index}.liveShoppingTitle`)} />
      </Stack>

      <Stack>
        <Button onClick={onOpen}>라이브 쇼핑에서 정보 가져오기</Button>
        <LoadLiveShoppingDataDialog
          onClose={onClose}
          isOpen={isOpen}
          onLoad={setItemValue}
        />
      </Stack>
    </Stack>
  );
}
