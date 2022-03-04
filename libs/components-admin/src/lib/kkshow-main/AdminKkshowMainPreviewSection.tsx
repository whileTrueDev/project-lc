import { Avatar, Box, Grid, GridItem, Input, Stack, Text } from '@chakra-ui/react';
import { ImageInput, ImageInputErrorTypes } from '@project-lc/components-core/ImageInput';
import { LiveShoppingWithGoods } from '@project-lc/hooks';
import { Preview, readAsDataURL } from '@project-lc/utils';
import { s3 } from '@project-lc/utils-s3';
import dayjs from 'dayjs';
import path from 'path';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { LiveShoppingListAutoComplete } from './KkshowMainCarouselItemDialog';

export function AdminKkshowMainPreviewSection(): JSX.Element {
  const { register, watch, setValue } = useFormContext();
  const [liveShoppingId, setLiveShoppingId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<Omit<Preview, 'id'> | null>(null);

  const handleSuccess = async (fileName: string, file: File): Promise<void> => {
    readAsDataURL(file).then(async ({ data }) => {
      const imageData = { url: data, filename: fileName, file };
      // setImagePrPeview(imageData);

      // 홍보용이미지
      const timestamp = new Date().getTime();
      const s3KeyType = `live-shopping-images/${liveShoppingId}/preview`;
      const key = path.join(s3KeyType, `${timestamp}_${imageData.filename}`);
      const { savedKey } = await s3.sendPutObjectCommand({
        Key: key,
        Body: imageData.file,
        ContentType: imageData.file.type,
        ACL: 'public-read',
      });
      setValue('trailer.imageUrl', savedKey, { shouldDirty: true });
    });
  };

  const handleError = (error: ImageInputErrorTypes): void => {
    console.log(error);
  };

  const onAutocompleteChange = (item: LiveShoppingWithGoods | null): void => {
    if (!item) return;
    const { broadcastStartDate, broadcaster, fmGoodsSeq, liveShoppingName, goods, id } =
      item;

    setLiveShoppingId(id);

    const { userNickname, avatar } = broadcaster;
    const option = goods.options[0];

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

      <Grid templateColumns="repeat(3, 1fr)" gap={6} height="450px">
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
          <Text>라이브 예고 썸네일(인스타 게시물 이미지)</Text>
          {watch('trailer.imageUrl') ? (
            <img alt="썸네일" src={watch('trailer.imageUrl')} width="100" height="100" />
          ) : (
            <ImageInput
              required={false}
              handleSuccess={handleSuccess}
              handleError={handleError}
            />
          )}
        </GridItem>
      </Grid>
    </Stack>
  );
}

export default AdminKkshowMainPreviewSection;
