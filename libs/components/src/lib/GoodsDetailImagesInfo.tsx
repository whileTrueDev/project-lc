import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useDisplaySize, useHorizontalScroll } from '@project-lc/hooks';
import { GoodsByIdRes } from '@project-lc/shared-types';
import React, { useRef } from 'react';

export interface GoodsDetailImagesInfoProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailImagesInfo({ goods }: GoodsDetailImagesInfoProps) {
  return (
    <Stack spacing={4}>
      {/* 상품이미지 */}
      <Stack spacing={2}>
        {/* 임시 이미지. s3 업로드된 이미지 필요 */}
        {/* {goods.image.map((x) => (
          <Image key={x.id} src={x.image} />
        ))} */}

        <Text>상품 사진 총 {goods.image.length} 장</Text>

        <HorizontalImageGallery
          images={[
            'https://picsum.photos/300/300',
            'https://picsum.photos/301/300',
            'https://picsum.photos/300/301',
            'https://picsum.photos/301/301',
            'https://picsum.photos/302/301',
            'https://picsum.photos/302/302',
            'https://picsum.photos/301/302',
          ]}
        />
      </Stack>

      {/* 상품상세설명 */}
      <Stack>
        <Text>상세설명 (상품 등록 작업 이후 에디터 UI작업 진행)</Text>
        <Text>{goods.contents || '없음'}</Text>
        <Box>
          <Button>자세히보기</Button>
        </Box>
      </Stack>
    </Stack>
  );
}

export interface HorizontalImageGalleryProps {
  images: string[];
}
export function HorizontalImageGallery({ images }: HorizontalImageGalleryProps) {
  const { isMobileSize } = useDisplaySize();
  const galleryRef = useRef<HTMLDivElement>(null);
  const { isEndOfLeft, isEndOfRight, scrollLeft, scrollRight } =
    useHorizontalScroll(galleryRef);

  return (
    <Flex position="relative" alignItems="center">
      {!isMobileSize && (
        <IconButton
          display={!isEndOfLeft ? 'flex' : 'none'}
          left={-5}
          position="absolute"
          aria-label="image-gallery-to-left"
          icon={<ChevronLeftIcon color="black" />}
          bgColor="whiteAlpha.900"
          isRound
          boxShadow="dark-lg"
          onClick={scrollLeft}
        />
      )}
      <HStack overflowX="auto" spacing={4} ref={galleryRef}>
        {images.map((img) => (
          <Image
            key={img}
            w={{ base: 260, sm: 300 }}
            h={{ base: 260, sm: 300 }}
            boxShadow="lg"
            borderRadius="xl"
            draggable={false}
            src={img}
          />
        ))}
      </HStack>
      {!isMobileSize && (
        <IconButton
          display={!isEndOfRight ? 'flex' : 'none'}
          right={-5}
          position="absolute"
          aria-label="image-gallery-to-right"
          icon={<ChevronRightIcon color="black" />}
          bgColor="whiteAlpha.900"
          isRound
          boxShadow="dark-lg"
          onClick={scrollRight}
        />
      )}
    </Flex>
  );
}
