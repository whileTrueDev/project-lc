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
import { LiveShoppingImageType } from '@prisma/client';
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
import { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { LiveShoppingListAutoComplete } from './LiveShoppingListAutoComplete';

export function AdminKkshowMainPreviewSection(): JSX.Element {
  const { register, watch, setValue } = useFormContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const liveShoppingId = watch('trailer.liveShoppingId');
  const profileImageUrl = watch('trailer.broadcasterProfileImageUrl');
  const broadcastStartDate = watch('trailer.broadcastStartDate');
  const dateRef = useRef<HTMLInputElement>(null);

  const { mutateAsync } = useAdminLiveShoppingImageMutation();
  const imageDataHandler = async (imageData: ImageInputFileReadData): Promise<void> => {
    const timestamp = new Date().getTime();
    const imageType: LiveShoppingImageType = 'trailer';
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
    const {
      broadcastStartDate: _broadcastStartDate,
      broadcaster,
      fmGoodsSeq,
      liveShoppingName,
      goods,
      id,
      images,
    } = item;

    const { userNickname, avatar } = broadcaster;
    const option = goods.options[0];
    const trailerImage = images.find((i) => i.type === 'trailer');

    if (trailerImage) {
      setValue('trailer.imageUrl', trailerImage.imageUrl, { shouldDirty: true });
    } else {
      setValue('trailer.imageUrl', '', { shouldDirty: true });
    }

    setValue('trailer.liveShoppingId', id, { shouldDirty: true });

    if (fmGoodsSeq) {
      setValue(
        'trailer.productLinkUrl',
        `https://k-kmarket.com/goods/view?no=${fmGoodsSeq}`,
      );
    }
    setValue('trailer.broadcastStartDate', _broadcastStartDate);
    if (_broadcastStartDate && dateRef.current) {
      dateRef.current.value = '';
    }
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

            <Text>
              방송일 :{' '}
              {broadcastStartDate ? (
                <Text as="span">
                  {dayjs(broadcastStartDate).format('YYYY.MM.DD (dd) a hh:mm')}
                </Text>
              ) : (
                <Text as="span">라이브쇼핑 정보를 불러오거나 방송일을 선택해주세요</Text>
              )}
            </Text>

            <Text>방송일 선택</Text>
            <Input
              type="datetime-local"
              ref={dateRef}
              onChange={(e) => {
                const { value } = e.currentTarget;
                setValue('trailer.broadcastStartDate', new Date(value));
              }}
            />

            <Stack direction="row">
              <Box>
                <Text>방송인 활동명</Text>
                <Input {...register('trailer.broadcasterNickname')} />
              </Box>
              <Box>
                <Text>프로필 이미지</Text>
                <Avatar src={profileImageUrl} />
                <Text>이미지 주소 입력</Text>
                <Input {...register('trailer.broadcasterProfileImageUrl')} />
              </Box>
            </Stack>

            <Text>
              방송인 해시태그 ( 콤마로 구분하여 작성해주세요. 특수문자 입력x, 띄어쓰기는
              가능)
            </Text>
            <Input
              placeholder="버츄얼,라방,트위치,유튜브"
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
