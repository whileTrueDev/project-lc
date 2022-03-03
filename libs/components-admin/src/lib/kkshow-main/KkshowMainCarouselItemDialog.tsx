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
} from '@chakra-ui/react';
import { ImageInput, ImageInputErrorTypes } from '@project-lc/components-core/ImageInput';
import {
  Preview,
  readAsDataURL,
} from '@project-lc/components-seller/GoodsRegistPictures';
import {
  KkshowMainCarouselItem,
  KkshowMainCarouselItemType,
} from '@project-lc/shared-types';
import React, { useRef, useState } from 'react';
import path from 'path';
import { s3 } from '@project-lc/utils-s3';
import { LiveShoppingWithGoods, useAdminLiveShoppingList } from '@project-lc/hooks';
import { ChakraAutoComplete } from '@project-lc/components-core/ChakraAutoComplete';

export function KkshowMainCarouselItemDialog({
  isOpen,
  onClose,
  createCallback,
}: {
  isOpen: boolean;
  onClose: () => void;
  createCallback: (data: KkshowMainCarouselItem) => void;
}): JSX.Element {
  const { data: liveShoppingList } = useAdminLiveShoppingList({
    enabled: true,
  });
  const [selectedLiveShopping, setSelectedLiveShopping] =
    useState<LiveShoppingWithGoods | null>(null);
  const [imagePreview, setImagePreview] = useState<Omit<Preview, 'id'> | null>(null);
  const linkUrlRef = useRef<HTMLInputElement>(null);
  const normalPriceRef = useRef<HTMLInputElement>(null);
  const discountPriceRef = useRef<HTMLInputElement>(null);
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

    handleClose();
  };
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
              <TabPanel>
                이미지배너
                <ImageInput handleSuccess={handleSuccess} handleError={handleError} />
                {imagePreview && (
                  <img src={imagePreview.url as string} alt={imagePreview.filename} />
                )}
                <Text>링크</Text>
                <Input ref={linkUrlRef} />
              </TabPanel>
              <TabPanel>
                라이브예고
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
                    setSelectedLiveShopping(newItem || null);
                  }}
                />
                {selectedLiveShopping && (
                  <Stack mt={4}>
                    <Divider />
                    <Box>
                      <Text>라이브쇼핑 홍보용 이미지 등록</Text>
                      <ImageInput
                        handleSuccess={handleSuccess}
                        handleError={handleError}
                      />
                      {imagePreview && (
                        <img
                          src={imagePreview.url as string}
                          alt={imagePreview.filename}
                        />
                      )}
                    </Box>
                    <Divider />
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
                            defaultValue={Number(
                              selectedLiveShopping.goods.options[0].price,
                            )}
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
                  </Stack>
                )}
              </TabPanel>
              <TabPanel>현재라이브</TabPanel>
              <TabPanel>이전라이브</TabPanel>
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
