import {
  Text,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Box,
  Avatar,
  Stack,
  Divider,
  RadioGroup,
  HStack,
  Radio,
} from '@chakra-ui/react';
import { ImageInput, ImageInputErrorTypes } from '@project-lc/components-core/ImageInput';

import {
  KkshowMainCarouselItem,
  KkshowMainCarouselItemType,
  LivePlatform,
} from '@project-lc/shared-types';
import React, { useMemo, useRef, useState } from 'react';
import path from 'path';
import { s3 } from '@project-lc/utils-s3';
import { LiveShoppingWithGoods, useAdminLiveShoppingList } from '@project-lc/hooks';
import { ChakraAutoComplete } from '@project-lc/components-core/ChakraAutoComplete';
import { Preview, readAsDataURL } from '@project-lc/components-core/ImageInputDialog';

/** 크크쇼메인데이터 중 라이브방송정보(라이브방송,판매상품,방송인) 조회하기 위한 autocomplete컴포넌트 */
export function LiveShoppingListAutoComplete({
  onChange,
}: {
  onChange: (item: LiveShoppingWithGoods | null) => void;
}): JSX.Element {
  const { data: liveShoppingList } = useAdminLiveShoppingList({
    enabled: true,
  });
  return (
    <ChakraAutoComplete
      options={
        liveShoppingList
          ? liveShoppingList.filter((l) =>
              ['adjusting', 'confirmed'].includes(l.progress),
            )
          : []
      }
      getOptionLabel={(option) => option?.liveShoppingName || ''}
      onChange={(newItem) => {
        onChange(newItem || null);
      }}
    />
  );
}

export function KkshowMainCarouselItemDialog({
  isOpen,
  onClose,
  createCallback,
}: {
  isOpen: boolean;
  onClose: () => void;
  createCallback: (data: KkshowMainCarouselItem) => void;
}): JSX.Element {
  const [selectedLiveShopping, setSelectedLiveShopping] =
    useState<LiveShoppingWithGoods | null>(null);
  const [imagePreview, setImagePreview] = useState<Omit<Preview, 'id'> | null>(null);
  const [platform, setPlatform] = useState<LivePlatform>('twitch');
  const linkUrlRef = useRef<HTMLInputElement>(null);
  const normalPriceRef = useRef<HTMLInputElement>(null);
  const discountPriceRef = useRef<HTMLInputElement>(null);
  const videoUrlRef = useRef<HTMLInputElement>(null);
  const tabList = useRef<{ key: KkshowMainCarouselItemType; label: string }[]>([
    { key: 'simpleBanner', label: '이미지배너' },
    { key: 'upcoming', label: '라이브예고' },
    { key: 'nowPlaying', label: '현재라이브' },
    { key: 'previous', label: '이전라이브' },
  ]);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const handleTabChange = (index: number): void => {
    setTabIndex(index);
    setImagePreview(null);
    setSelectedLiveShopping(null);
  };

  const handleSuccess = (fileName: string, file: File): void => {
    readAsDataURL(file).then(({ data }) => {
      const imageData = { url: data, filename: fileName, file };
      setImagePreview(imageData);
    });
  };
  const handleError = (error: ImageInputErrorTypes): void => {
    console.log(error);
  };

  const handleClose = (): void => {
    onClose();
    setImagePreview(null);
    setSelectedLiveShopping(null);
  };

  const handleCreate = async (): Promise<void> => {
    const currentTab = tabList.current[tabIndex].key;

    if (currentTab === 'simpleBanner') {
      if (!linkUrlRef.current || !imagePreview) return;
      const link = linkUrlRef.current.value;
      // s3에 데이터 저장
      // 이미지배너의 경우 키는 kkshow-main-carousel-images/타임스탬프_파일명.확장자
      const timestamp = new Date().getTime();
      const s3KeyType = 'kkshow-main-carousel-images';
      const key = path.join(s3KeyType, `${timestamp}_${imagePreview.filename}`);

      const { savedKey } = await s3.sendPutObjectCommand({
        Key: key,
        Body: imagePreview.file,
        ContentType: imagePreview.file.type,
        ACL: 'public-read',
      });
      // 저장된 이미지 url 받아오기
      // append 받아와서 링크url이랑 이미지 url 넘기기
      createCallback({
        type: 'simpleBanner',
        linkUrl: link,
        imageUrl: savedKey,
      });
    }

    if (currentTab === 'upcoming') {
      if (
        !selectedLiveShopping ||
        !imagePreview ||
        !normalPriceRef.current ||
        !discountPriceRef.current
      )
        return;
      // 홍보용이미지
      const timestamp = new Date().getTime();
      const s3KeyType = `live-shopping-images/${selectedLiveShopping.id}/carousel`;
      const key = path.join(s3KeyType, `${timestamp}_${imagePreview.filename}`);
      const { savedKey } = await s3.sendPutObjectCommand({
        Key: key,
        Body: imagePreview.file,
        ContentType: imagePreview.file.type,
        ACL: 'public-read',
      });
      createCallback({
        type: 'upcoming',
        imageUrl: savedKey,
        productName: selectedLiveShopping.liveShoppingName || '',
        productImageUrl: selectedLiveShopping.goods.image[0].image,
        normalPrice: Number(normalPriceRef.current.value),
        discountedPrice: Number(discountPriceRef.current.value),
        productLinkUrl: `https://k-kmarket.com/goods/view?no=${selectedLiveShopping.fmGoodsSeq}`,
        profileImageUrl: selectedLiveShopping.broadcaster.avatar || '',
        broadcasterNickname: selectedLiveShopping.broadcaster.userNickname,
        promotionPageLinkUrl:
          selectedLiveShopping.broadcaster.BroadcasterPromotionPage?.url || '',
      });
    }

    if (currentTab === 'nowPlaying') {
      if (
        !selectedLiveShopping ||
        !normalPriceRef.current ||
        !discountPriceRef.current ||
        !videoUrlRef.current
      )
        return;

      createCallback({
        type: 'nowPlaying',
        platform,
        videoUrl: videoUrlRef.current.value,
        productName: selectedLiveShopping.liveShoppingName || '',
        productImageUrl: selectedLiveShopping.goods.image[0].image,
        normalPrice: Number(normalPriceRef.current.value),
        discountedPrice: Number(discountPriceRef.current.value),
        productLinkUrl: `https://k-kmarket.com/goods/view?no=${selectedLiveShopping.fmGoodsSeq}`,
        profileImageUrl: selectedLiveShopping.broadcaster.avatar || '',
        broadcasterNickname: selectedLiveShopping.broadcaster.userNickname,
        promotionPageLinkUrl:
          selectedLiveShopping.broadcaster.BroadcasterPromotionPage?.url || '',
      });
    }

    if (currentTab === 'previous') {
      if (!selectedLiveShopping || !normalPriceRef.current || !discountPriceRef.current)
        return;

      createCallback({
        type: 'previous',
        videoUrl: selectedLiveShopping.liveShoppingVideo?.youtubeUrl,
        productName: selectedLiveShopping.liveShoppingName || '',
        productImageUrl: selectedLiveShopping.goods.image[0].image,
        normalPrice: Number(normalPriceRef.current.value),
        discountedPrice: Number(discountPriceRef.current.value),
        productLinkUrl: `https://k-kmarket.com/goods/view?no=${selectedLiveShopping.fmGoodsSeq}`,
        profileImageUrl: selectedLiveShopping.broadcaster.avatar || '',
        broadcasterNickname: selectedLiveShopping.broadcaster.userNickname,
        promotionPageLinkUrl:
          selectedLiveShopping.broadcaster.BroadcasterPromotionPage?.url || '',
      });
    }

    handleClose();
  };

  const imagePreviewComponent = useMemo(() => {
    return (
      <>
        <ImageInput handleSuccess={handleSuccess} handleError={handleError} />
        {imagePreview && (
          <img src={imagePreview.url as string} alt={imagePreview.filename} />
        )}
      </>
    );
  }, [imagePreview]);

  const broadcasterAndProductInfo = useMemo(() => {
    return (
      selectedLiveShopping && (
        <Stack direction="row" spacing={8}>
          <Stack>
            <Text>방송인</Text>
            <Avatar
              src={selectedLiveShopping.broadcaster.avatar || ''}
              name={selectedLiveShopping.broadcaster.userNickname}
            />
          </Stack>
          <Stack>
            <Text>라이브 쇼핑 제목</Text>
            <Text>{selectedLiveShopping.liveShoppingName}</Text>
          </Stack>
          <Stack>
            <Text>상품 사진</Text>
            <img
              width="50"
              height="50"
              src={selectedLiveShopping.goods.image[0].image}
              alt="상품이미지"
            />
          </Stack>
          <Stack>
            <Text>가격</Text>
            <Stack direction="row">
              <Text>원가</Text>
              <Input
                ref={normalPriceRef}
                type="number"
                width="100px"
                defaultValue={Number(selectedLiveShopping.goods.options[0].price)}
              />
            </Stack>
            <Stack direction="row">
              <Text>할인가</Text>
              <Input
                ref={discountPriceRef}
                type="number"
                width="100px"
                color="red"
                defaultValue={Number(
                  selectedLiveShopping.goods.options[0].consumer_price,
                )}
              />
            </Stack>
          </Stack>
        </Stack>
      )
    );
  }, [selectedLiveShopping]);

  const liveShoppingAutocomplete = useMemo(() => {
    return (
      <Box>
        <Text>라이브 방송 정보 선택</Text>
        <LiveShoppingListAutoComplete onChange={setSelectedLiveShopping} />
      </Box>
    );
  }, []);
  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>캐러셀 아이템 추가 다이얼로그 {tabIndex}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs index={tabIndex} onChange={handleTabChange}>
            <TabList>
              {tabList.current.map((tl) => (
                <Tab key={tl.key}>{tl.label}</Tab>
              ))}
            </TabList>
            <TabPanels>
              {/* 이미지배너 */}
              <TabPanel>
                <Text>
                  이미지배너 - 캐러셀에 표시될 이미지와 클릭하여 이동할 링크를 등록합니다.
                </Text>

                {imagePreviewComponent}
                <Text>연결할 링크</Text>
                <Input ref={linkUrlRef} />
              </TabPanel>

              {/* 라이브예고 */}
              <TabPanel>
                <Text>
                  라이브예고 - 진행 예정인 라이브쇼핑을 선택하여 홍보이미지를 등록합니다.
                </Text>
                {liveShoppingAutocomplete}
                {selectedLiveShopping && (
                  <Stack mt={4}>
                    <Divider />
                    <Box>
                      <Text>라이브쇼핑 홍보용 이미지 등록</Text>
                      {imagePreviewComponent}
                    </Box>
                    <Divider />
                    {broadcasterAndProductInfo}
                  </Stack>
                )}
              </TabPanel>
              <TabPanel>
                <Text>현재라이브 - 라이브커머스 진행중인 영상 임베드용</Text>
                <Stack mt={4}>
                  {liveShoppingAutocomplete}

                  {selectedLiveShopping && <Box>{broadcasterAndProductInfo}</Box>}
                  <Divider />
                  <Box>
                    <Text>라이브 송출 플랫폼</Text>
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
                  </Box>
                  <Divider />
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

                    <Input ref={videoUrlRef} />
                  </Box>
                </Stack>
              </TabPanel>
              <TabPanel>
                <Stack>
                  <Text>
                    이전라이브 - 진행했던 라이브쇼핑을 선택하여 유튜브 동영상을 표시합니다
                  </Text>
                  {liveShoppingAutocomplete}
                  <Divider />
                  {selectedLiveShopping && (
                    <Box>
                      {broadcasterAndProductInfo}
                      {selectedLiveShopping?.liveShoppingVideo?.youtubeUrl ? (
                        <Text>
                          등록한 영상 URL :{' '}
                          {selectedLiveShopping?.liveShoppingVideo?.youtubeUrl}
                        </Text>
                      ) : (
                        <Text>
                          등록된 영상 URL이 없습니다. 라이브 쇼핑 목록 탭에서 해당
                          라이브쇼핑에 대한 유튜브 영상 url을 등록해주세요
                        </Text>
                      )}
                    </Box>
                  )}
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleCreate}>
            생성
          </Button>

          <Button variant="ghost" onClick={onClose}>
            닫기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
