import { Avatar, Container, Flex, Heading, Stack } from '@chakra-ui/react';
import MotionBox from '@project-lc/components-core/MotionBox';
import { Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import KkshowMainTitle from './KkshowMainTitle';

export function KkshowMainBestBroadcaster(): JSX.Element {
  const items = [
    { broadcasterName: '_쵸단', avatarUrl: '' },
    { broadcasterName: '신맛', avatarUrl: '' },
    { broadcasterName: '길고길고길고길고길고길고길고긴이름', avatarUrl: '' },
    { broadcasterName: '김홀릭', avatarUrl: '' },
    { broadcasterName: '띠요올', avatarUrl: '' },
    { broadcasterName: '살인마협회장', avatarUrl: '' },
    { broadcasterName: '더미1', avatarUrl: '' },
    { broadcasterName: '더미2', avatarUrl: '' },
    { broadcasterName: '더미3', avatarUrl: '' },
    { broadcasterName: '더미4', avatarUrl: '' },
  ];
  return (
    <MotionBox
      py={20}
      id="kkshow-blue-scroll"
      position="relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      viewport={{ once: true }}
    >
      <KkshowMainTitle>BEST 방송인</KkshowMainTitle>
      <Container as={Flex} maxW="5xl" py={10} gap={6}>
        <Swiper
          style={{ paddingTop: 24, paddingBottom: 24 }}
          spaceBetween={16}
          slidesPerView="auto"
          scrollbar
          modules={[Scrollbar]}
        >
          {items.map((x) => (
            <SwiperSlide key={x.avatarUrl} style={{ maxWidth: 190 }}>
              <BestBroadcasterItem
                avatarUrl={x.avatarUrl}
                broadcasterName={x.broadcasterName}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </MotionBox>
  );
}

interface BestBroadcasterItemProps {
  broadcasterName: string;
  avatarUrl: string;
}
function BestBroadcasterItem(props: BestBroadcasterItemProps): JSX.Element {
  return (
    <Stack
      textAlign="center"
      justify="center"
      align="center"
      gap={2}
      key={props.broadcasterName}
    >
      <Avatar
        w={{ base: 120, md: 160 }}
        h={{ base: 120, md: 160 }}
        src={props.avatarUrl}
      />
      <Heading noOfLines={2} fontSize="xl">
        {props.broadcasterName}
      </Heading>
    </Stack>
  );
}
