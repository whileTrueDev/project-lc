import {
  Avatar,
  Box,
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import ImageInputDialog, {
  ImageInputFileReadData,
} from '@project-lc/components-core/ImageInputDialog';
import { LiveShoppingWithGoods } from '@project-lc/hooks';
import {
  KkshowMainResData,
  NowPlayingLiveItem,
  PreviousLiveItem,
  ProductAndBroadcasterInfo,
  SimpleBannerItem,
  UpcomingLiveItem,
} from '@project-lc/shared-types';
import { getAdminHost } from '@project-lc/utils';
import { s3 } from '@project-lc/utils-s3';
import path from 'path';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { LiveShoppingListAutoComplete } from './LiveShoppingListAutoComplete';

interface CarouselItemProps {
  index: number;
}

/** 크크쇼 메인 캐러셀 아이템 컴포넌트 - 이미지 배너 */
export function CarouselItemSimpleBanner({
  index,
  item,
}: CarouselItemProps & { item: SimpleBannerItem }): JSX.Element {
  const { register, setValue, watch } = useFormContext<KkshowMainResData>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const imageUrl = watch(`carousel.${index}.imageUrl`);

  const handleConfirm = async (imageData: ImageInputFileReadData): Promise<void> => {
    const timestamp = new Date().getTime();
    const s3KeyType = 'kkshow-main-carousel-images';
    const key = path.join(s3KeyType, `${timestamp}_${imageData.filename}`);

    const { savedKey } = await s3.sendPutObjectCommand({
      Key: key,
      Body: imageData.file,
      ContentType: imageData.file.type,
      ACL: 'public-read',
    });

    setValue(`carousel.${index}.imageUrl`, savedKey, { shouldDirty: true });
  };
  return (
    <>
      <Text fontWeight="bold">이미지배너</Text>
      <ImageBanner imageUrl={imageUrl} />
      <Box>
        <Button onClick={onOpen}>배너 {imageUrl ? '수정' : '추가'}</Button>
        <ImageInputDialog
          modalTitle={`배너 이미지 ${imageUrl ? '수정' : '추가'}`}
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={handleConfirm}
        />
      </Box>

      <Box>
        <Text>배너 링크 주소</Text>
        <Input {...register(`carousel.${index}.linkUrl` as const)} size="sm" />
      </Box>
    </>
  );
}

/** 크크쇼 메인 캐러셀 아이템 컴포넌트 - 라이브 예고 */
export function CarouselItemUpcomingLive({
  index,
  item,
}: CarouselItemProps & { item: UpcomingLiveItem }): JSX.Element {
  const { setValue, watch } = useFormContext<KkshowMainResData>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const imageUrl = watch(`carousel.${index}.imageUrl`);

  const handleConfirm = async (imageData: ImageInputFileReadData): Promise<void> => {
    const timestamp = new Date().getTime();
    const s3KeyType = `live-shopping-images/${
      item.liveShoppingId ? item.liveShoppingId : 'unknown'
    }/carousel`;
    const key = path.join(s3KeyType, `${timestamp}_${imageData.filename}`);

    const { savedKey } = await s3.sendPutObjectCommand({
      Key: key,
      Body: imageData.file,
      ContentType: imageData.file.type,
      ACL: 'public-read',
    });

    // TODO : 라이브 쇼핑 id가 있는경우 해당 liveShoppingImages에 type; carousel로 저장(upsert)

    setValue(`carousel.${index}.imageUrl`, savedKey, { shouldDirty: true });
  };

  return (
    <>
      <Text fontWeight="bold">라이브예고</Text>
      <Stack>
        <ImageBanner imageUrl={imageUrl} />
        <Box>
          <Button onClick={onOpen}>이미지{imageUrl ? '수정' : '추가'}</Button>
          <ImageInputDialog
            modalTitle={`이미지 ${imageUrl ? '수정' : '추가'}`}
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={handleConfirm}
          />
        </Box>
      </Stack>

      <CarouselItemProductAndBroadcasterInfo index={index} {...item} />
    </>
  );
}

/** 크크쇼 메인 캐러셀 아이템 컴포넌트 - 현재 라이브 */
export function CarouselItemNowPlayingLive({
  index,
  item,
}: CarouselItemProps & { item: NowPlayingLiveItem }): JSX.Element {
  const { register, watch } = useFormContext<KkshowMainResData>();
  return (
    <>
      <Text fontWeight="bold">현재라이브</Text>
      <Box>
        <Stack direction="row">
          <Text>플랫폼 </Text>
          <RadioGroup mb={1} value={watch(`carousel.${index}.platform` as const)}>
            <HStack>
              <Radio {...register(`carousel.${index}.platform` as const)} value="twitch">
                트위치
              </Radio>
              <Radio {...register(`carousel.${index}.platform` as const)} value="youtube">
                유튜브
              </Radio>
            </HStack>
          </RadioGroup>
        </Stack>

        <VideoImbed
          videoUrl={
            item.platform === 'twitch'
              ? `https://player.twitch.tv/?channel=${item.videoUrl}&parent=${
                  getAdminHost().includes('localhost') ? 'localhost' : getAdminHost()
                }`
              : `https://www.youtube.com/embed/${item.videoUrl}`
          }
        />
      </Box>

      <CarouselItemProductAndBroadcasterInfo index={index} {...item} />
    </>
  );
}

/** 크크쇼 메인 캐러셀 아이템 컴포넌트 - 이전 라이브 */
export function CarouselItemPreviousLive({
  index,
  item,
}: CarouselItemProps & { item: PreviousLiveItem }): JSX.Element {
  return (
    <>
      <Text fontWeight="bold">이전라이브</Text>
      <VideoImbed
        videoUrl={`https://www.youtube.com/embed/${item.videoUrl.replace(
          'https://youtu.be/',
          '',
        )}`}
      />
      <CarouselItemProductAndBroadcasterInfo index={index} {...item} />
    </>
  );
}

export function ImageBanner({ imageUrl }: { imageUrl: string }): JSX.Element {
  if (!imageUrl) return <Text>이미지가 없습니다</Text>;
  return (
    <Box>
      <Text>이미지</Text>
      <img src={imageUrl} width="100" height="100" alt="" />
    </Box>
  );
}

export function VideoImbed({ videoUrl }: { videoUrl: string }): JSX.Element {
  return (
    <Box>
      <Text>영상</Text>
      <iframe
        title={videoUrl}
        allowFullScreen
        src={videoUrl}
        frameBorder="0"
        height="100"
        width="200"
      />
    </Box>
  );
}

export function BroadcasterProfile({
  profileImageUrl,
}: {
  profileImageUrl: string;
}): JSX.Element {
  return (
    <Box>
      <Text>방송인</Text>
      <Avatar src={profileImageUrl} />
    </Box>
  );
}

export function ProductImage({
  productImageUrl,
}: {
  productImageUrl: string;
}): JSX.Element {
  if (!productImageUrl) return <Text>상품 이미지가 없습니다</Text>;
  return (
    <Box>
      <Text>상품</Text>
      <img src={productImageUrl} alt="" width="50" height="50" />
    </Box>
  );
}

export function CarouselItemProductAndBroadcasterInfo(
  props: ProductAndBroadcasterInfo & { index: number },
): JSX.Element {
  const { index } = props;
  const { register, setValue, watch } = useFormContext<KkshowMainResData>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const profileImageUrl = watch(`carousel.${index}.profileImageUrl`);
  const productImageUrl = watch(`carousel.${index}.productImageUrl`);

  const setItemValue = (data: LiveShoppingWithGoods): void => {
    setValue(`carousel.${index}.profileImageUrl`, data.goods.image[0].image, {
      shouldDirty: true,
    });
    setValue(`carousel.${index}.productImageUrl`, data.goods.image[0].image, {
      shouldDirty: true,
    });
    setValue(`carousel.${index}.liveShoppingName`, data.liveShoppingName || '', {
      shouldDirty: true,
    });
    setValue(
      `carousel.${index}.productLinkUrl`,
      data.fmGoodsSeq ? `https://k-kmarket.com/goods/view?no=${data.fmGoodsSeq}` : '',
      { shouldDirty: true },
    );
    setValue(`carousel.${index}.normalPrice`, Number(data.goods.options[0].price), {
      shouldDirty: true,
    });
    setValue(
      `carousel.${index}.discountedPrice`,
      Number(data.goods.options[0].consumer_price),
      { shouldDirty: true },
    );
    setValue(`carousel.${index}.liveShoppingId`, Number(data.id), { shouldDirty: true });

    const carouselImage = data.images.find((i) => i.type === 'carousel');
    if (carouselImage && carouselImage.imageUrl) {
      setValue(`carousel.${index}.imageUrl`, carouselImage.imageUrl, {
        shouldDirty: true,
      });
    }
  };
  return (
    <Stack direction="row">
      <BroadcasterProfile profileImageUrl={profileImageUrl} />
      <ProductImage productImageUrl={productImageUrl || ''} />

      <Stack>
        {/* 라이브쇼핑명, 상품링크, 가격 */}
        <Stack direction="row">
          <Stack>
            <Box>
              <Text>라이브쇼핑명</Text>
              <Input
                {...register(`carousel.${index}.liveShoppingName` as const)}
                size="sm"
              />
            </Box>
            <Box>
              <Text>상품링크</Text>
              <Input
                {...register(`carousel.${index}.productLinkUrl` as const)}
                size="sm"
              />
            </Box>
          </Stack>
          <Stack>
            <Box>
              <Text>기존가격</Text>
              <Input
                type="number"
                {...register(`carousel.${index}.normalPrice` as const, {
                  valueAsNumber: true,
                })}
                size="sm"
              />
            </Box>
            <Box>
              <Text>할인가격</Text>
              <Input
                type="number"
                color="red"
                {...register(`carousel.${index}.discountedPrice` as const, {
                  valueAsNumber: true,
                })}
                size="sm"
              />
            </Box>
          </Stack>
        </Stack>
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

export function LoadLiveShoppingDataDialog({
  isOpen,
  onClose,
  onLoad,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (data: LiveShoppingWithGoods) => void;
}): JSX.Element {
  const [selectedLiveShopping, setSelectedLiveShopping] =
    useState<LiveShoppingWithGoods | null>(null);

  const closeHandler = (): void => {
    setSelectedLiveShopping(null);
    onClose();
  };

  const loadHandler = (): void => {
    if (!selectedLiveShopping) return;
    onLoad(selectedLiveShopping);
    closeHandler();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeHandler}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>라이브쇼핑 정보 불러오기</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Text>라이브 방송 정보 선택</Text>
            <LiveShoppingListAutoComplete onChange={setSelectedLiveShopping} />
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={loadHandler}>
            가져오기
          </Button>

          <Button variant="ghost" onClick={closeHandler}>
            닫기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
