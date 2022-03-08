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
import EmbededVideo from '@project-lc/components-shared/EmbededVideo';
import { useKkshowMain } from '@project-lc/hooks';
import { Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import KkshowMainTitle from './KkshowMainTitle';

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function KkshowMainBestLive(): JSX.Element {
  return (
    <Box py={20}>
      <KkshowMainTitle>BEST 라이브</KkshowMainTitle>
      <BestLiveList />
    </Box>
  );
}

function BestLiveList(): JSX.Element | null {
  const { data } = useKkshowMain();

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
        {data &&
          data.bestLive.map((item) => (
            <SwiperSlide key={item.liveShoppingId} style={{ width: 320 - 16 }}>
              <LiveCard {...item} />
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
      {data &&
        data.bestLive.map((item, index) => (
          <GridItem colSpan={2} key={item.liveShoppingId}>
            <MotionBox
              key={item.liveShoppingId}
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
              <LiveCard {...item} />
            </MotionBox>
          </GridItem>
        ))}
    </Grid>
  );

  const v = useBreakpointValue({ base: BestLiveListMobile, md: BestLiveListDesktop });
  if (!data) return null;
  return v ?? null;
}

interface LiveCardProps {
  videoUrl: string;
  liveShoppingTitle: string;
  liveShoppingDescription: string;
  profileImageUrl: string;
}
function LiveCard({
  videoUrl,
  liveShoppingTitle,
  liveShoppingDescription,
  profileImageUrl,
}: LiveCardProps): JSX.Element {
  const youtubeSrc = videoUrl.replace('https://youtu.be/', '');

  const profileImage = profileImageUrl.replace('70x70', '300x300');
  return (
    <Box
      rounded="2xl"
      w="100%"
      maxW="lg"
      bgColor="gray.100"
      color="blackAlpha.900"
      boxShadow="lg"
    >
      <Box h={{ base: 180, md: 300 }}>
        <EmbededVideo
          provider="youtube"
          identifier={youtubeSrc}
          style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
        />
      </Box>

      <Flex align="center" justify="space-between" py={2} px={4} gap={4}>
        <Stack justify="center" h={100}>
          <Text fontWeight="extrabold" fontSize={{ base: 'md', md: 'lg' }} noOfLines={1}>
            {liveShoppingDescription}
          </Text>
          <Heading fontSize={{ base: 'lg', md: '2xl' }} noOfLines={2}>
            {liveShoppingTitle}
          </Heading>
        </Stack>

        <Box>
          <BorderedAvatar src={profileImage} size="lg" />
        </Box>
      </Flex>
    </Box>
  );
}

export default KkshowMainBestLive;
