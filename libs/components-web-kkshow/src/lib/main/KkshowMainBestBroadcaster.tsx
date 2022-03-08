import {
  Avatar,
  Container,
  Flex,
  Heading,
  LinkBox,
  LinkOverlay,
  Stack,
} from '@chakra-ui/react';
import MotionBox from '@project-lc/components-core/MotionBox';
import { useKkshowMain } from '@project-lc/hooks';
import NextLink from 'next/link';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import KkshowMainTitle from './KkshowMainTitle';

export function KkshowMainBestBroadcaster(): JSX.Element | null {
  const { data } = useKkshowMain();
  if (!data) return null;

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
          style={{ paddingTop: 24, paddingBottom: 24, width: '100%' }}
          spaceBetween={16}
          slidesPerView="auto"
          // scrollbar
          pagination
          modules={[Pagination]}
        >
          {data.bestBroadcaster.map((x) => (
            <SwiperSlide
              key={x.broadcasterId}
              style={{ maxWidth: 190, paddingBottom: 24 }}
            >
              <BestBroadcasterItem
                avatarUrl={x.profileImageUrl}
                broadcasterName={x.nickname}
                href={x.promotionPageLinkUrl}
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
  href: string;
}
function BestBroadcasterItem(props: BestBroadcasterItemProps): JSX.Element {
  return (
    <LinkBox>
      <Stack
        textAlign="center"
        justify="center"
        align="center"
        gap={2}
        key={props.broadcasterName}
        role="group"
      >
        <Avatar
          w={{ base: 120, md: 160 }}
          h={{ base: 120, md: 160 }}
          src={props.avatarUrl}
          cursor="pointer"
          _groupHover={{
            transition: '0.1s',
            outline: '4px solid',
            outlineColor: 'blue.400',
            outlineOffset: 4,
            boxShadow: 'xl',
          }}
        />

        <NextLink passHref href={props.href}>
          <LinkOverlay isExternal>
            <Heading noOfLines={2} fontSize="xl">
              {props.broadcasterName}
            </Heading>
          </LinkOverlay>
        </NextLink>
      </Stack>
    </LinkBox>
  );
}