import { Box, Flex, Heading, Stack, Text, useBreakpointValue } from '@chakra-ui/react';
import BorderedAvatar from '@project-lc/components-core/BorderedAvatar';
import MotionBox from '@project-lc/components-core/MotionBox';
import EmbededVideo from '@project-lc/components-shared/EmbededVideo';
import { useKkshowMain } from '@project-lc/hooks';
import { Grid as SwiperGrid, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import KkshowMainTitle from './KkshowMainTitle';

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
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
            <SwiperSlide
              key={`${item.liveShoppingTitle}_${item.liveShoppingId}`}
              style={{ width: '90%', maxWidth: 320 }}
            >
              <LiveCard {...item} />
            </SwiperSlide>
          ))}
      </Swiper>
    </Box>
  );

  const BestLiveListDesktop = (
    <MotionBox
      maxW="5xl"
      mx="auto"
      px={2}
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <Swiper
        style={{ paddingTop: 24, paddingBottom: 24 }}
        spaceBetween={24}
        slidesPerView={2}
        scrollbar
        grabCursor
        grid={{ rows: 2, fill: 'row' }}
        modules={[Scrollbar, SwiperGrid]}
      >
        {data &&
          data.bestLive.map((item) => (
            <SwiperSlide key={`${item.liveShoppingTitle}_${item.liveShoppingId}`}>
              <LiveCard {...item} />
            </SwiperSlide>
          ))}
      </Swiper>
    </MotionBox>
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
      <Box h={{ base: 180, md: 300 }} className="livecard-embed-container">
        <EmbededVideo provider="youtube" identifier={youtubeSrc} />
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
