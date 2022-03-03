import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import BorderedAvatar from '@project-lc/components-core/BorderedAvatar';
import MotionBox from '@project-lc/components-core/MotionBox';
import { Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import KkshowMainTitle from './KkshowMainTitle';

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const items = [
  {
    name: '쵸단 X 귀빈정',
    title: '해피쵸이어',
    thumbnail: 'images/main/th-3.png',
    videoSrc: 'https://www.youtube.com/embed/4Bkuhi7i7Mk?controls=0',
    profileImage:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/04ace7cf-1f09-439a-af6f-dc8d878d814b-profile_image-300x300.png',
  },
  {
    name: '연나비 X 홍봉자굴림치즈만두홍봉자굴림치즈만두',
    title:
      '신맛의 오늘의 맛신맛의 오늘의 맛신맛의 오늘의 맛신맛의 오늘의 맛신맛의 오늘의 맛',
    thumbnail: 'images/main/th-1.png',
    videoSrc: 'https://www.youtube.com/embed/TutKdpA-JRw?controls=0',
    profileImage:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/04ace7cf-1f09-439a-af6f-dc8d878d814b-profile_image-300x300.png',
  },
  {
    name: '유은 X 먹고집',
    title: '토여니의 토요일은 즐거워',
    thumbnail: 'images/main/th-2.png',
    videoSrc: 'https://www.youtube.com/embed/3TLj00xYR-k?controls=0',
    profileImage:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/04ace7cf-1f09-439a-af6f-dc8d878d814b-profile_image-300x300.png',
  },
  {
    name: '나는야꼬등어 X 동래아들',
    title: '메리크크쇼마스',
    thumbnail: 'images/main/th-4.png',
    videoSrc: 'https://www.youtube.com/embed/vFv6ZUOEnAo?controls=0',
    profileImage:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/04ace7cf-1f09-439a-af6f-dc8d878d814b-profile_image-300x300.png',
  },
];

export function KkshowMainBestLive(): JSX.Element {
  return (
    <Box py={20}>
      <KkshowMainTitle>BEST 라이브</KkshowMainTitle>
      <BestLiveList />
    </Box>
  );
}

function BestLiveList(): JSX.Element | null {
  const BestLiveListMobile = (
    <Box p={2} pos="relative">
      <Box
        pos="absolute"
        backgroundImage="images/main/bg-circle-4.png"
        backgroundSize="contain"
        w={200}
        h={200}
        left={-70}
        top={-30}
      />
      <Swiper
        style={{ paddingTop: 24, paddingBottom: 24 }}
        spaceBetween={16}
        slidesPerView="auto"
        scrollbar
        modules={[Scrollbar]}
      >
        {items.map((item) => (
          <SwiperSlide key={item.name} style={{ width: 320 - 16 }}>
            <LiveCard liveShopping={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );

  const BestLiveListDesktop = (
    <Grid
      maxW="5xl"
      mx="auto"
      templateColumns="repeat(4, 1fr)"
      gap={6}
      px={2}
      pos="relative"
    >
      <Box
        pos="absolute"
        backgroundImage="images/main/bg-circle-4.png"
        backgroundSize="contain"
        w={300}
        h={300}
        left={-100}
        top={-100}
      />
      {items.map((item, index) => (
        <GridItem colSpan={2} key={item.name}>
          <MotionBox
            key={item.name}
            pos="relative"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Box
              pos="absolute"
              bgColor="blue.500"
              py={2}
              px={4}
              top={3}
              left={3}
              rounded="lg"
            >
              <Heading fontSize="lg" color="whiteAlpha.900">
                {index + 1}
              </Heading>
            </Box>
            <LiveCard liveShopping={item} />
          </MotionBox>
        </GridItem>
      ))}
    </Grid>
  );

  const v = useBreakpointValue({ base: BestLiveListMobile, md: BestLiveListDesktop });
  return v ?? null;
}

interface LiveCardProps {
  liveShopping: {
    name: string;
    videoSrc: string;
    title: string;
    profileImage: string;
  };
}
function LiveCard({ liveShopping }: LiveCardProps): JSX.Element {
  return (
    <Box
      key={liveShopping.name}
      rounded="2xl"
      w="100%"
      maxW="lg"
      bgColor="gray.100"
      color="blackAlpha.900"
      boxShadow="lg"
    >
      <Box h={{ base: 180, md: 300 }}>
        {/* <Image borderTopRadius="2xl" src={liveShopping.thumbnail} w="100%" h="100%" /> */}
        <iframe
          style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
          width="100%"
          height="100%"
          src={liveShopping.videoSrc}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Box>

      <Flex align="center" justify="space-between" py={2} px={4} gap={4}>
        <Stack justify="center" h={100}>
          <Text fontWeight="extrabold" fontSize={{ base: 'md', md: 'lg' }} noOfLines={1}>
            {liveShopping.name}
          </Text>
          <Heading fontSize={{ base: 'lg', md: '2xl' }} noOfLines={2}>
            {liveShopping.title}
          </Heading>
        </Stack>

        <Box>
          <BorderedAvatar src={liveShopping.profileImage} size="lg" />
        </Box>
      </Flex>
    </Box>
  );
}

export default KkshowMainBestLive;
