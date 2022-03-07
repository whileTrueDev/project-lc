import {
  Avatar,
  Box,
  Button,
  Grid,
  GridItem,
  Input,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import ImageInputDialog, {
  ImageInputFileReadData,
} from '@project-lc/components-core/ImageInputDialog';
import {
  LiveShoppingWithGoods,
  useAdminLiveShoppingImageMutation,
} from '@project-lc/hooks';
import { s3 } from '@project-lc/utils-s3';
import dayjs from 'dayjs';
import path from 'path';
import { useFormContext } from 'react-hook-form';
import { LiveShoppingListAutoComplete } from './LiveShoppingListAutoComplete';

export function AdminKkshowMainPreviewSection(): JSX.Element {
  const { register, watch, setValue } = useFormContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const liveShoppingId = watch('trailer.liveShoppingId');

  const { mutateAsync } = useAdminLiveShoppingImageMutation();
  const imageDataHandler = async (imageData: ImageInputFileReadData): Promise<void> => {
    const timestamp = new Date().getTime();
    const imageType = 'trailer';
    // liveshoppingId 가 없는경우 해당값은 null로 들어감
    const s3KeyType = `live-shopping-images/${liveShoppingId}/${imageType}`;
    const key = path.join(s3KeyType, `${timestamp}_${imageData.filename}`);

    const { savedKey } = await s3.sendPutObjectCommand({
      Key: key,
      Body: imageData.file,
      ContentType: imageData.file.type,
      ACL: 'public-read',
    });
    if (liveShoppingId) {
      await mutateAsync({
        liveShoppingId,
        imageType,
        imageUrl: savedKey,
      }).catch((e) => console.error(e));
    }
    setValue('trailer.imageUrl', savedKey, { shouldDirty: true });

    return Promise.resolve();
  };

  const onAutocompleteChange = (item: LiveShoppingWithGoods | null): void => {
    if (!item) return;
    const { broadcastStartDate, broadcaster, fmGoodsSeq, liveShoppingName, goods, id } =
      item;

    const { userNickname, avatar } = broadcaster;
    const option = goods.options[0];

    setValue('trailer.liveShoppingId', id, { shouldDirty: true });

    if (fmGoodsSeq) {
      setValue(
        'trailer.productLinkUrl',
        `https://k-kmarket.com/goods/view?no=${fmGoodsSeq}`,
      );
    }
    setValue('trailer.broadcastStartDate', broadcastStartDate);
    setValue('trailer.liveShoppingName', liveShoppingName);
    setValue('trailer.broadcasterProfileImageUrl', avatar);
    setValue('trailer.broadcasterNickname', userNickname);
    setValue('trailer.normalPrice', option.price);
    setValue('trailer.discountedPrice', option.consumer_price);
  };

  return (
    <Stack>
      <Text fontWeight="bold" size="lg">
        라이브 예고 영역
      </Text>

      <Grid templateColumns="repeat(3, 1fr)" gap={6} minHeight="450px">
        <GridItem height="100%" w="100%">
          <Stack>
            <Text>라이브쇼핑 정보 불러오기</Text>
            <LiveShoppingListAutoComplete onChange={onAutocompleteChange} />
          </Stack>
        </GridItem>

        <GridItem height="100%" w="100%">
          <Stack>
            <Text>상품링크</Text>
            <Input {...register('trailer.productLinkUrl')} />

            <Text>라이브 쇼핑 제목</Text>
            <Input {...register('trailer.liveShoppingName')} />

            <Text>방송일</Text>
            <Text>
              {dayjs(watch('trailer.broadcastStartDate')).format(
                'YYYY.MM.DD (dd) a hh:mm',
              )}
            </Text>

            <Stack direction="row">
              <Box>
                <Text>방송인 활동명</Text>
                <Input {...register('trailer.broadcasterNickname')} />
              </Box>
              <Box>
                <Text>방송인 프로필 이미지</Text>
                <Avatar src={watch('trailer.broadcasterProfileImageUrl')} />
              </Box>
            </Stack>

            <Text>설명글</Text>
            <Input
              placeholder="#방송에 대한 설명글 #혹은 #관련 해시태그를 입력해주세요"
              {...register('trailer.broadcasterDescription')}
            />

            <Stack direction="row">
              <Box>
                <Text>원래 판매가격</Text>
                <Input
                  type="number"
                  {...register('trailer.normalPrice', { valueAsNumber: true })}
                />
              </Box>
              <Box>
                <Text>할인된 판매가격</Text>
                <Input
                  type="number"
                  color="red"
                  {...register('trailer.discountedPrice', { valueAsNumber: true })}
                />
              </Box>
            </Stack>
          </Stack>
        </GridItem>
        <GridItem height="100%" w="100%">
          <Stack>
            <Text>라이브 예고 썸네일(인스타 게시물 이미지)</Text>

            {watch('trailer.imageUrl') && (
              <img
                alt="썸네일"
                src={watch('trailer.imageUrl')}
                width="100"
                height="100"
              />
            )}
            <Button onClick={onOpen}>
              썸네일 {watch('trailer.imageUrl') ? '수정' : '등록'}하기
            </Button>
            <ImageInputDialog
              modalTitle="라이브 예고 썸네일 등록하기"
              isOpen={isOpen}
              onClose={onClose}
              onConfirm={imageDataHandler}
            />
          </Stack>
        </GridItem>
      </Grid>
    </Stack>
  );
}

export default AdminKkshowMainPreviewSection;
