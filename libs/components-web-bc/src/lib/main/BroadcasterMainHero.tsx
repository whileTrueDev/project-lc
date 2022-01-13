import { Box, Button, Flex, Heading, Image, Stack, Text } from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import MotionBox from '@project-lc/components-core/MotionBox';
import { ChevronIconButton } from '@project-lc/components-core/HorizontalImageGallery';
import { useDisplaySize } from '@project-lc/hooks';
import { DragHandlers } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaYoutube } from 'react-icons/fa';
import { Thumbnail, defaultThumbnails } from './broadcasterMainConstants';

export function BroadcasterMainHero(): JSX.Element {
  return (
    <Flex
      flexDir="column"
      justify="center"
      alignItems="center"
      minH={{ base: 600, sm: 'unset' }}
      bgGradient="linear(to-b, blue.400, blue.500)"
      position="relative"
      overflowY="hidden"
      overflowX="hidden"
      flexWrap="nowrap"
    >
      <Box position="absolute" right={50} bottom={100}>
        <Image draggable={false} src="/images/main/hatched-1.png" />
      </Box>
      <Box position="absolute" left="15%" top={100}>
        <Image draggable={false} src="/images/main/hatched-2.png" />
      </Box>
      <Box position="absolute" left={0} bottom={0}>
        <Image draggable={false} src="/images/main/hero-ellipse-1.png" />
      </Box>
      <Box position="absolute" left="50%" top={0}>
        <Image draggable={false} src="/images/main/hero-ellipse-2.png" />
      </Box>
      <Box position="absolute" left="20%" top={0}>
        <Image draggable={false} src="/images/main/hero-ellipse-3.png" />
      </Box>
      <Box position="absolute" right={0} top="30%">
        <Image draggable={false} src="/images/main/hero-ellipse-4.png" />
      </Box>

      {/* 제목 */}
      <Box>
        <Stack color="white" alignItems="center" mt={{ base: 16, lg: 24 }}>
          <Heading>방송인 센터</Heading>
          <Box textAlign="center" fontWeight="bold">
            <Text whiteSpace={{ base: 'break-spaces', sm: 'unset' }}>
              {'간단한 설정으로\n라이브 쇼핑 진행 및 수익 정산까지 가능합니다.'}
            </Text>
            <Text whiteSpace={{ base: 'break-spaces', sm: 'unset' }}>
              {'팬들과 소통하며 상품을 판매하고\n추억과 수익을 쌓아보세요!'}
            </Text>
          </Box>
        </Stack>
      </Box>

      {/* 갤러리 */}
      <ThumbnailCarousel thumbnails={defaultThumbnails} />
    </Flex>
  );
}

export default BroadcasterMainHero;

interface ThumbnailCarouselProps {
  thumbnails: Thumbnail[];
}
function ThumbnailCarousel({ thumbnails }: ThumbnailCarouselProps): JSX.Element {
  const [data, setData] = useState(thumbnails);
  const centerIdx = useMemo(() => Math.ceil((data.length - 1) / 2), [data.length]);

  // 썸네일 배열 순서 변경
  const rotate = useCallback(
    (range = 1, reverse?: boolean): void => {
      const arr = [...data];
      for (let i = 0; i < range; i++) {
        if (reverse) arr.unshift(arr.pop() as Thumbnail);
        else arr.push(arr.shift() as Thumbnail);
      }
      setData(arr);
    },
    [data],
  );
  // 썸네일 클릭 핸들러 (순서 변경)
  const onThumbClick = (clickedIdx: number): void => {
    const sub = centerIdx - clickedIdx;
    const isReverseDirection = sub > 0;
    const range = Math.abs(sub);
    rotate(range, isReverseDirection);
  };
  // 썸네일 드래그 핸들러 (순서 변경)
  const onThumbDragEnd: DragHandlers['onDragEnd'] = (_, info) => {
    if (info.offset.x < -200) rotate();
    else if (info.offset.x > 200) rotate(1, true);
  };

  // 5초 마다 썸네일 로테이션 추가
  useEffect(() => {
    const ms = 1000;
    const t = setTimeout(() => rotate(1, true), 5 * ms);
    return () => clearTimeout(t);
  }, [rotate]);

  return (
    <Box w={1920} position="relative">
      <Flex
        gap={{ base: 1, sm: 4 }}
        justify="center"
        alignItems="center"
        height="inherit"
        h={{ base: 300, sm: 400, md: 600 }}
      >
        {data.map((thumb, idx) => (
          <ThumbnailCarouselItem
            key={thumb.image}
            isCentered={idx === Math.ceil((data.length - 1) / 2)}
            thumbnail={thumb}
            onThumbnailClick={() => onThumbClick(idx)}
            onLeftIconClick={() => rotate(1, true)}
            onRightIconClick={() => rotate()}
            onDragEnd={onThumbDragEnd}
          />
        ))}
      </Flex>
    </Box>
  );
}

interface ThumbnailCarouselItemProps {
  isLeft?: boolean;
  isCentered?: boolean;
  thumbnail: Thumbnail;
  onThumbnailClick: () => void;
  onRightIconClick: () => void;
  onLeftIconClick: () => void;
  onDragEnd: DragHandlers['onDragEnd'];
}
function ThumbnailCarouselItem({
  isCentered = false,
  thumbnail,
  onThumbnailClick,
  onRightIconClick,
  onLeftIconClick,
  onDragEnd,
}: ThumbnailCarouselItemProps): JSX.Element {
  const { isMobileSize } = useDisplaySize();
  if (isCentered) {
    return (
      <MotionBox
        layoutId={thumbnail.image}
        animate={{ scale: !isMobileSize ? 1.5 : 1, opacity: 1 }}
        key={thumbnail.image}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.05}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onDragEnd={onDragEnd}
        dragTransition={{ bounceStiffness: 1000, bounceDamping: 100 }}
        zIndex="docked"
        backgroundColor="white"
        borderRadius="2xl"
        shadow="dark-lg"
        p={4}
        transform="scale(1.5)"
        position="relative"
        w={{ base: 280, sm: 'unset' }}
        display="flex"
        alignItems="center"
      >
        <ChakraNextImage
          borderRadius="2xl"
          src={thumbnail.image}
          width="500"
          height="300"
          quality={100}
        />
        <Button
          aria-label={`link-button-${thumbnail.youtubeUrl}`}
          bgColor="white"
          fontWeight="medium"
          _hover={{ bgColor: 'gray.100' }}
          _active={{ bgColor: 'gray.100' }}
          color="black"
          my={1}
          px={1}
          variant="solid"
          size="xs"
          fontSize="xx-small"
          borderRadius="2xl"
          onClick={() => window.open(thumbnail.youtubeUrl)}
          position="absolute"
          top={0}
          right={1}
          gap={1}
        >
          <FaYoutube fontSize="28px" color="red" />
          영상 보기
        </Button>
        <ChevronIconButton
          size={isMobileSize ? 'md' : 'xs'}
          left={-7}
          direction="left"
          isVisible
          onClick={onLeftIconClick}
        />
        <ChevronIconButton
          size={isMobileSize ? 'md' : 'xs'}
          right={-7}
          direction="right"
          isVisible
          onClick={onRightIconClick}
        />
      </MotionBox>
    );
  }
  return (
    <MotionBox
      layoutId={thumbnail.image}
      key={thumbnail.image}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      borderRadius="2xl"
      onClick={onThumbnailClick}
      w={{ base: 280, sm: 'unset' }}
    >
      <ChakraNextImage
        borderRadius="2xl"
        src={thumbnail.image}
        width="490"
        height="300"
        quality="100"
        filter="brightness(0.7)"
        _hover={{ filter: 'brightness(1)', bgColor: 'white' }}
        transition="all 0.3s"
        cursor="pointer"
      />
    </MotionBox>
  );
}
