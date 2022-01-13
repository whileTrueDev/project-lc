import { Box, Flex, Heading, IconButton, Image, Stack, Text } from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import MotionBox from '@project-lc/components-core/MotionBox';
import { useDisplaySize } from '@project-lc/hooks';
import { DragHandlers } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';
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

  return (
    <Box w={1920} position="relative">
      <Flex
        // templateColumns={{ base: 'repeat(5, 1fr)', xl: '1fr 1fr 1fr 1fr 1fr' }}
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
            onClick={() => onThumbClick(idx)}
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
  onClick: () => void;
  onDragEnd: DragHandlers['onDragEnd'];
}
function ThumbnailCarouselItem({
  isCentered = false,
  thumbnail,
  onClick,
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
        pb={3}
        transform="scale(1.5)"
        position="relative"
        w={{ base: 280, sm: 'unset' }}
      >
        <ChakraNextImage
          borderRadius="2xl"
          src={thumbnail.image}
          width="500"
          height="300"
          quality={100}
        />
        <IconButton
          aria-label={`link-button-${thumbnail.youtubeUrl}`}
          icon={<FaYoutube fontSize="28px" color="red" />}
          variant="unstyle"
          size="xs"
          onClick={() => window.open(thumbnail.youtubeUrl)}
          position="absolute"
          top={1}
          right={1.5}
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
      onClick={onClick}
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
