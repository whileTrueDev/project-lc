import {
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  ScaleFade,
  SlideFade,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { BorderedAvatar } from '@project-lc/components-core/BorderedAvatar';
import { ChevronIconButton } from '@project-lc/components-core/HorizontalImageGallery';
import { WaveBox } from '@project-lc/components-core/WaveBox';
import { RedLinedText } from '@project-lc/components-core/RedLinedText';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';

export function KkshowMainCarousel(): JSX.Element {
  return (
    <WaveBox position="relative" bgColor="blue.500">
      <Flex h={{ base: 530, md: 700 }}>
        <CustomSwipper />
      </Flex>
    </WaveBox>
  );
}

const swipeItems = [
  {
    image: 'images/main/th-1.png',
    avatar: 'https://i.pravatar.cc/300',
    item: {
      title: '쵸단 X 길고길고길고길고길고긴 상품명',
    },
  },
  {
    image: 'images/main/th-2.png',
    avatar: 'https://i.pravatar.cc/301',
    item: {
      title: '쵸단 X 길고길고길고길고길고긴 상품명길고길고길고길고길고긴 상품명',
    },
  },
  {
    image: 'images/main/th-3.png',
    avatar: 'https://i.pravatar.cc/302',
    item: {
      title: '쵸단 X 상품명',
    },
  },
];

function CustomSwipper(): JSX.Element {
  const slidesPerView = useBreakpointValue<'auto' | number>({ base: 1, md: 'auto' });
  return (
    <Swiper
      updateOnWindowResize
      spaceBetween={120}
      slidesPerView={slidesPerView}
      centeredSlides
      loop
      loopedSlides={swipeItems.length}
      pagination={{ clickable: true }}
      modules={[Pagination, Autoplay, Navigation]}
      style={{ height: '100%' }}
      autoplay={{ delay: 5 * 1000, disableOnInteraction: false }}
    >
      {swipeItems.map((item) => (
        <SwiperSlide
          style={{ minWidth: 320, width: 720, margin: '0 auto' }}
          key={item.avatar}
        >
          {(slideProps) => (
            <SwipperItem
              key={item.image}
              image={item.image}
              title={item.item.title}
              avatar={item.avatar}
              isActive={slideProps.isActive}
            />
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

interface SwipperItemProps {
  image: string;
  title: string;
  avatar: string;
  isActive: boolean;
}
function SwipperItem({ image, title, avatar, isActive }: SwipperItemProps): JSX.Element {
  const swiper = useSwiper();
  return (
    <Flex
      h="100%"
      mx={{ base: 2, md: 4 }}
      gap={4}
      flexDir="column"
      justify={{ base: 'flex-start', md: 'center' }}
      position="relative"
    >
      <ScaleFade in={isActive} transition={{ enter: { duration: 0.5 } }}>
        <Box
          textAlign="center"
          color="whiteAlpha.900"
          visibility={isActive ? 'visible' : 'hidden'}
        >
          <Heading fontSize={{ base: 'lg', md: '3xl' }}>
            NOW{' '}
            <Heading fontSize={{ base: 'lg', md: '3xl' }} as="span" fontWeight="medium">
              PLAYING
            </Heading>
          </Heading>
        </Box>
      </ScaleFade>
      <Box
        borderRadius="xl"
        bgColor="white"
        h={{ base: 300, md: 400 }}
        p={1}
        onClick={() => alert('asdf')}
        cursor="pointer"
        filter={isActive ? 'none' : 'brightness(50%)'}
        boxShadow={isActive ? '2x' : 'none'}
        transitionDuration="0.5s"
      >
        <Box position="relative" w="100%" h="100%">
          <iframe
            style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/4Bkuhi7i7Mk?controls=0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
      </Box>

      <SlideFade
        in={isActive}
        transition={{ enter: { duration: 0.5 }, exit: { duration: 0 } }}
        offsetY={-14}
      >
        <LiveShoppingPreviewBox avatar={avatar} title={title} />
      </SlideFade>

      {isActive && (
        <>
          <ChevronIconButton
            variant="outlined"
            direction="left"
            left={-100}
            bottom="50%"
            onClick={() => swiper.slidePrev()}
          />

          <ChevronIconButton
            variant="outlined"
            direction="right"
            right={-100}
            bottom="50%"
            onClick={() => swiper.slideNext()}
          />
        </>
      )}
    </Flex>
  );
}
export default KkshowMainCarousel;

interface LiveShoppingPreviewBoxProps {
  avatar: string;
  title: string;
}
function LiveShoppingPreviewBox({
  avatar,
  title,
}: LiveShoppingPreviewBoxProps): JSX.Element {
  const avatarSize = useBreakpointValue({ base: 'xl', md: 'xl' });
  return (
    <HStack h={100} alignItems="center" spacing={{ base: 2, sm: 4 }}>
      <BorderedAvatar size={avatarSize} src={avatar} />
      <HStack
        color="blackAlpha.900"
        bgColor="white"
        w="100%"
        h="100%"
        borderRadius="xl"
        justify="space-around"
        alignItems="center"
        p={[2, 4]}
        px={[2, 6]}
        textAlign={['center', 'unset']}
        spacing={4}
      >
        <Box>
          <Heading fontSize="lg" fontWeight="medium" noOfLines={2} maxW={280}>
            <Text
              p={1}
              as="span"
              bgColor="red"
              color="white"
              textTransform="uppercase"
              fontSize="xs"
              fontWeight="bold"
              borderRadius="md"
            >
              live
            </Text>{' '}
            {title}
          </Heading>
          <Heading lineHeight={1}>
            <RedLinedText as="span" fontSize="sm" fontWeight="medium">
              9,999원{' '}
            </RedLinedText>
            <Text as="span" fontSize="md" color="red" fontWeight="bold">
              1,999원
            </Text>
          </Heading>
        </Box>

        <Box display={{ base: 'none', sm: 'block' }}>
          <Image src="images/main/dosirak.png" w="65px" h="65px" />
        </Box>
      </HStack>
    </HStack>
  );
}
