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
import { useAdminLiveShoppingImageMutation } from '@project-lc/hooks';
import {
  KkshowMainResData,
  LivePlatform,
  LiveShoppingWithGoods,
  NowPlayingLiveItem,
  PreviousLiveItem,
  ProductAndBroadcasterInfo,
  SimpleBannerItem,
  UpcomingLiveItem,
} from '@project-lc/shared-types';
import { getAdminHost } from '@project-lc/utils';
import { s3 } from '@project-lc/utils-s3';
import path from 'path';
import { useMemo, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { LiveShoppingListAutoComplete } from './LiveShoppingListAutoComplete';

interface CarouselItemProps {
  index: number;
}

/** 크크쇼 메인 캐러셀 아이템 컴포넌트 - 이미지 배너 */
export function CarouselItemSimpleBanner({
  index,
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
      <Box>
        <Text>배너 설명</Text>
        <Input {...register(`carousel.${index}.description` as const)} size="sm" />
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
  const liveShoppingId = watch(`carousel.${index}.liveShoppingId`);

  const { mutateAsync } = useAdminLiveShoppingImageMutation();
  const handleConfirm = async (imageData: ImageInputFileReadData): Promise<void> => {
    const timestamp = new Date().getTime();
    const imageType = 'carousel';
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { watch } = useFormContext<KkshowMainResData>();
  const videoUrl = watch(`carousel.${index}.videoUrl`);
  const platform = watch(`carousel.${index}.platform` as const);
  const embedUrl = useMemo(() => {
    if (!videoUrl) return '';
    if (platform === 'twitch') {
      return `https://player.twitch.tv/?channel=${videoUrl}&parent=${
        getAdminHost().includes('localhost') ? 'localhost' : getAdminHost()
      }`;
    }
    return `https://www.youtube.com/embed/${videoUrl}`;
  }, [platform, videoUrl]);
  return (
    <>
      <Text fontWeight="bold">현재라이브</Text>
      <Stack>
        {embedUrl ? (
          <>
            <Text>플랫폼 :{platform}</Text>
            <VideoImbed videoUrl={embedUrl} />
          </>
        ) : (
          <Text>등록된 라이브 송출 채널이 없습니다.</Text>
        )}
        <Button onClick={onOpen}>라이브 송출 채널 등록</Button>
        <LiveStreamingPlatformDialog isOpen={isOpen} onClose={onClose} index={index} />
      </Stack>

      <CarouselItemProductAndBroadcasterInfo index={index} {...item} />
    </>
  );
}

export function LiveStreamingPlatformDialog({
  isOpen,
  onClose,
  index,
}: {
  isOpen: boolean;
  onClose: () => void;
  index: number;
}): JSX.Element {
  const { setValue, getValues } = useFormContext<KkshowMainResData>();
  const [platform, setPlatform] = useState<LivePlatform>(
    getValues(`carousel.${index}.platform`) || 'twitch',
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const closeHandler = (): void => {
    onClose();
  };

  const confirmHandler = (): void => {
    if (!inputRef.current) return;
    setValue(`carousel.${index}.videoUrl`, inputRef.current.value, { shouldDirty: true });
    setValue(`carousel.${index}.platform`, platform, { shouldDirty: true });
    closeHandler();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeHandler}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>라이브 송출 채널 등록</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Text>라이브 송출 플랫폼 선택</Text>
            <RadioGroup
              mb={1}
              value={platform}
              onChange={(value) => setPlatform(value as LivePlatform)}
            >
              <HStack>
                <Radio value="twitch">트위치</Radio>
                <Radio value="youtube">유튜브</Radio>
              </HStack>
            </RadioGroup>
            <Box>
              <Text>동영상 코드</Text>
              {platform === 'twitch' && (
                <Text>
                  www.twitch.tv/
                  <Text as="span" color="red">
                    chodan_
                  </Text>
                  에서{' '}
                  <Text as="span" color="red">
                    chodan_
                  </Text>{' '}
                  부분만 입력
                </Text>
              )}
              {platform === 'youtube' && (
                <Text>
                  https://youtu.be/
                  <Text as="span" color="red">
                    cseb1WG15ZA
                  </Text>
                  에서{' '}
                  <Text as="span" color="red">
                    cseb1WG15ZA
                  </Text>{' '}
                  부분만 입력
                </Text>
              )}

              <Input
                ref={inputRef}
                defaultValue={getValues(`carousel.${index}.videoUrl`)}
              />
            </Box>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={confirmHandler}>
            저장
          </Button>

          <Button variant="ghost" onClick={closeHandler}>
            닫기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

/** 크크쇼 메인 캐러셀 아이템 컴포넌트 - 이전 라이브 */
export function CarouselItemPreviousLive({
  index,
  item,
}: CarouselItemProps & { item: PreviousLiveItem }): JSX.Element {
  const { watch, register } = useFormContext<KkshowMainResData>();
  const videoUrl = watch(`carousel.${index}.videoUrl`);
  const liveShoppingId = watch(`carousel.${index}.liveShoppingId`);
  const embedUrl = useMemo(() => {
    if (!videoUrl) {
      return '';
    }
    return `https://www.youtube.com/embed/${videoUrl.replace('https://youtu.be/', '')}`;
  }, [videoUrl]);
  return (
    <>
      <Text fontWeight="bold">이전라이브</Text>

      <Box>
        {embedUrl && <VideoImbed videoUrl={embedUrl} />}
        {!embedUrl && !liveShoppingId && (
          <Box>
            <Text>
              유튜브 영상 주소 ( https://youtu.be/4pIuCJTMXQU ) 같은 형태로 입력
            </Text>
            <Input {...register(`carousel.${index}.videoUrl` as const)} />
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
  if (!productImageUrl) return <Text>상품 이미지 없음</Text>;
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
    setValue(`carousel.${index}.liveShoppingId`, data.id, { shouldDirty: true });
    setValue(`carousel.${index}.liveShoppingProgress`, data.progress);
    setValue(`carousel.${index}.broadcastStartDate`, data.broadcastStartDate);
    setValue(`carousel.${index}.broadcastEndDate`, data.broadcastEndDate);
    setValue(`carousel.${index}.profileImageUrl`, data.goods.image[0].image);
    setValue(`carousel.${index}.productImageUrl`, data.goods.image[0].image);
    setValue(`carousel.${index}.liveShoppingName`, data.liveShoppingName || '');
    setValue(
      `carousel.${index}.productLinkUrl`,
      data.fmGoodsSeq ? `https://k-kmarket.com/goods/view?no=${data.fmGoodsSeq}` : '',
    );
    setValue(`carousel.${index}.normalPrice`, Number(data.goods.options[0].price));
    setValue(
      `carousel.${index}.discountedPrice`,
      Number(data.goods.options[0].consumer_price),
    );

    setValue(
      `carousel.${index}.broadcasterNickname`,
      data.broadcaster.userNickname || data.broadcaster.userName || '',
    );
    setValue(
      `carousel.${index}.promotionPageLinkUrl`,
      data.broadcaster.BroadcasterPromotionPage?.url || '',
    );

    const carouselImage = data.images.find((i) => i.type === 'carousel');
    if (carouselImage && carouselImage.imageUrl) {
      setValue(`carousel.${index}.imageUrl`, carouselImage.imageUrl, {
        shouldDirty: true,
      });
    }

    const videoUrl = data.liveShoppingVideo?.youtubeUrl;
    if (videoUrl) {
      setValue(`carousel.${index}.videoUrl`, videoUrl, { shouldDirty: true });
    }
  };
  return (
    <Stack direction="row">
      <Box>
        <Stack direction="row">
          <BroadcasterProfile profileImageUrl={profileImageUrl} />
          <Box>
            <Text>프로필 이미지 주소</Text>
            <Input {...register(`carousel.${index}.profileImageUrl` as const)} />
          </Box>
        </Stack>

        <Stack direction="row">
          <ProductImage productImageUrl={productImageUrl} />
          <Box>
            <Text>상품 이미지 주소</Text>
            <Input {...register(`carousel.${index}.productImageUrl` as const)} />
          </Box>
        </Stack>
      </Box>

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
