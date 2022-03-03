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
import { useAdminLiveShoppingList } from '@project-lc/hooks';
import { LiveShopping } from '@prisma/client';
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
  const { data: liveShoppingList, isLoading } = useAdminLiveShoppingList({
    enabled: true,
  });
  const [selectedLiveShopping, setSelectedLiveShopping] = useState<LiveShopping | null>(
    null,
  );
  const [imagePreview, setImagePreview] = useState<Omit<Preview, 'id'> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tabList = useRef<{ key: KkshowMainCarouselItemType; label: string }[]>([
    { key: 'simpleBanner', label: '이미지배너' },
    { key: 'upcoming', label: '라이브예고' },
    { key: 'nowPlaying', label: '현재라이브' },
    { key: 'previous', label: '이전라이브' },
  ]);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const handleTabChange = (index: number): void => setTabIndex(index);

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
  };

  const handleCreate = async (): Promise<void> => {
    if (!inputRef.current || !imagePreview) return;
    const link = inputRef.current.value;
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
    console.log({ link, savedKey });
    if (tabList.current[tabIndex].key === 'simpleBanner') {
      createCallback({
        type: 'simpleBanner',
        linkUrl: link,
        imageUrl: savedKey,
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
                <Input ref={inputRef} />
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
