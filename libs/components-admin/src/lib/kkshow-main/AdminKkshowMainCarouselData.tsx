import {
  Stack,
  Text,
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  HStack,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import { ImageInput } from '@project-lc/components-core/ImageInput';
import { readAsDataURL } from '@project-lc/components-seller/GoodsRegistPictures';
import {
  KkshowMainCarouselItem,
  KkshowMainCarouselItemType,
} from '@project-lc/shared-types';
import { getAdminHost } from '@project-lc/utils';
import React, { useRef } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

export function AdminKkshowMainCarouselSection(): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { control, register } = useFormContext();
  const { fields, append, remove, swap, move, insert } = useFieldArray({
    control,
    name: 'carousel' as const,
  });

  return (
    <Stack>
      <Stack direction="row" alignItems="center">
        <Text fontWeight="bold" size="lg">
          캐러셀 영역
        </Text>
        <Stack direction="row">
          <Button onClick={onOpen}>캐러셀 아이템 추가하기</Button>
          <KkshowMainCarouselItemDialog isOpen={isOpen} onClose={onClose} />
        </Stack>
      </Stack>

      <Stack direction="row" flexWrap="wrap">
        {fields.map((field, index) => {
          return (
            <Stack key={field.id} w="100%" maxH="200px">
              <AdminKkshowMainCarouselItemBoxLayout removeHandler={() => remove(index)}>
                <AdminKkshowMainCarouselItemView
                  index={index}
                  item={field as unknown as KkshowMainCarouselItem}
                />
              </AdminKkshowMainCarouselItemBoxLayout>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}

export default AdminKkshowMainCarouselSection;

export function KkshowMainCarouselItemDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element {
  const tabList = useRef<{ key: KkshowMainCarouselItemType; label: string }[]>([
    { key: 'simpleBanner', label: '이미지배너' },
    { key: 'upcoming', label: '라이브예고' },
    { key: 'nowPlaying', label: '현재라이브' },
    { key: 'previous', label: '이전라이브' },
  ]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>캐러셀 아이템 추가 다이얼로그</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs>
            <TabList>
              {tabList.current.map((tl) => (
                <Tab key={tl.key}>{tl.label}</Tab>
              ))}
            </TabList>
            <TabPanels>
              <TabPanel>이미지배너</TabPanel>
              <TabPanel>라이브예고</TabPanel>
              <TabPanel>현재라이브</TabPanel>
              <TabPanel>이전라이브</TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
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

export function AdminKkshowMainCarouselItemBoxLayout({
  children,
  removeHandler,
}: {
  children: React.ReactNode;
  removeHandler?: () => void;
}): JSX.Element {
  return (
    <Stack direction="row" border="1px" w="100%" p={1} alignItems="center" mb={1}>
      {children}
      <Button onClick={removeHandler}>delete</Button>
    </Stack>
  );
}

export function ImageBanner({ imageUrl }: { imageUrl: string }): JSX.Element {
  return (
    <Box>
      <Text>배너이미지</Text>
      <img src={imageUrl} width="200" height="200" alt="" />
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
      <Text>방송인 프로필 이미지</Text>
      <img src={profileImageUrl} alt="" width="80" height="80" />
    </Box>
  );
}

export function ProductImage({
  productImageUrl,
}: {
  productImageUrl: string;
}): JSX.Element {
  return (
    <Box>
      <Text>상품이미지</Text>
      <img src={productImageUrl} alt="" width="100" height="100" />
    </Box>
  );
}

export function AdminKkshowMainCarouselItemView({
  item,
  index,
}: {
  item: KkshowMainCarouselItem;
  index: number;
}): JSX.Element {
  const { type } = item;
  const { register, watch } = useFormContext();

  switch (type) {
    case 'simpleBanner':
      return (
        <>
          <Text fontWeight="bold">이미지배너</Text>
          <ImageBanner imageUrl={item.imageUrl} />
          <Box>
            <Text>배너 링크 주소</Text>
            <Input
              {...register(`carousel.${index}.linkUrl` as const, {
                required: true,
              })}
              size="sm"
            />
          </Box>
        </>
      );
    case 'upcoming':
      return (
        <>
          <Text fontWeight="bold">라이브예고</Text>
          <ImageBanner imageUrl={item.imageUrl} />
          <Stack direction="row">
            <BroadcasterProfile profileImageUrl={item.profileImageUrl} />

            {item.productImageUrl && (
              <ProductImage productImageUrl={item.productImageUrl} />
            )}
            <Box>
              <Text>상품링크</Text>
              <Input
                {...register(`carousel.${index}.productLinkUrl` as const)}
                size="sm"
              />
            </Box>
          </Stack>
        </>
      );
    case 'nowPlaying':
      return (
        <>
          <Text fontWeight="bold">현재라이브</Text>
          <Box>
            <Stack direction="row">
              <Text>플랫폼 </Text>
              <RadioGroup mb={1} value={watch(`carousel.${index}.platform` as const)}>
                <HStack>
                  <Radio
                    {...register(`carousel.${index}.platform` as const)}
                    value="twitch"
                  >
                    트위치
                  </Radio>
                  <Radio
                    {...register(`carousel.${index}.platform` as const)}
                    value="youtube"
                  >
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

          <Stack direction="row">
            <BroadcasterProfile profileImageUrl={item.profileImageUrl} />

            <ProductImage productImageUrl={item.productImageUrl} />
            <Box>
              <Text>상품링크</Text>
              <Input
                {...register(`carousel.${index}.productLinkUrl` as const)}
                size="sm"
              />
            </Box>
          </Stack>
        </>
      );
    case 'previous':
      return (
        <>
          <Text fontWeight="bold">이전라이브</Text>
          <VideoImbed videoUrl={`https://www.youtube.com/embed/${item.videoUrl}`} />
        </>
      );

    default:
      return <Text>{`not supported carousel item type : ${type}`}</Text>;
  }
}
