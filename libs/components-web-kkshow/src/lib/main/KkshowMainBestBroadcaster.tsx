import {
  Avatar,
  Container,
  Flex,
  Heading,
  LinkBox,
  LinkOverlay,
  Stack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import MotionBox from '@project-lc/components-core/MotionBox';
import { Pagination, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import KkshowMainTitle from './KkshowMainTitle';

export function KkshowMainBestBroadcaster(): JSX.Element {
  const items = [
    { broadcasterName: '_쵸단', avatarUrl: 'https://i.pravatar.cc/300' },
    { broadcasterName: '신맛', avatarUrl: 'https://i.pravatar.cc/301' },
    {
      broadcasterName: '길고길고길고길고길고길고길고긴이름',
      avatarUrl: 'https://i.pravatar.cc/302',
    },
    { broadcasterName: '김홀릭', avatarUrl: 'https://i.pravatar.cc/303' },
    { broadcasterName: '띠요올', avatarUrl: 'https://i.pravatar.cc/304' },
    { broadcasterName: '살인마협회장', avatarUrl: 'https://i.pravatar.cc/305' },
    { broadcasterName: '더미1', avatarUrl: 'https://i.pravatar.cc/306' },
    { broadcasterName: '더미2', avatarUrl: 'https://i.pravatar.cc/307' },
    { broadcasterName: '더미3', avatarUrl: 'https://i.pravatar.cc/308' },
    { broadcasterName: '더미4', avatarUrl: 'https://i.pravatar.cc/309' },
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
          // scrollbar
          pagination
          modules={[Pagination]}
        >
          {items.map((x) => (
            <SwiperSlide key={x.avatarUrl} style={{ maxWidth: 190, paddingBottom: 24 }}>
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
      <NextLink passHref href="https://k-kmarket.com">
        <Avatar
          w={{ base: 120, md: 160 }}
          h={{ base: 120, md: 160 }}
          src={props.avatarUrl}
          cursor="pointer"
          as="a"
          _hover={{
            transition: '0.1s',
            outline: '2px solid',
            outlineColor: 'blue.400',
            outlineOffset: 4,
            boxShadow: 'xl',
          }}
        />
      </NextLink>
      <Heading noOfLines={2} fontSize="xl">
        {props.broadcasterName}
      </Heading>
    </Stack>
  );
}
