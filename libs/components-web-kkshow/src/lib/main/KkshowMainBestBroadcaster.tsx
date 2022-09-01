import {
  Avatar,
  Box,
  Container,
  Flex,
  Heading,
  LinkBox,
  LinkOverlay,
  Stack,
} from '@chakra-ui/react';
import MotionBox from '@project-lc/components-core/MotionBox';
import { useKkshowMain, useLiveShoppingNowOnLive } from '@project-lc/hooks';
import NextLink from 'next/link';
import { useMemo } from 'react';
import { Pagination, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import KkshowMainTitle from './KkshowMainTitle';

export function KkshowMainBestBroadcaster(): JSX.Element | null {
  const { data } = useKkshowMain();
  if (!data) return null;

  return (
    <Box py={20} position="relative">
      <KkshowMainTitle>BEST 방송인</KkshowMainTitle>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <Container as={Flex} maxW="5xl" py={10} gap={6}>
          <Swiper
            style={{ paddingTop: 24, paddingBottom: 24, width: '100%' }}
            spaceBetween={16}
            slidesPerView="auto"
            scrollbar
            modules={[Pagination, Scrollbar]}
          >
            {data.bestBroadcaster.map((x) => (
              <SwiperSlide
                key={`${x.nickname}_${x.broadcasterId}`}
                style={{ maxWidth: 190, width: '45%', paddingBottom: 24 }}
              >
                <BestBroadcasterItem
                  broadcasterId={x.broadcasterId || undefined}
                  avatarUrl={x.profileImageUrl}
                  broadcasterName={x.nickname}
                  href={x.promotionPageLinkUrl}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </MotionBox>
    </Box>
  );
}

interface BestBroadcasterItemProps {
  broadcasterId?: number;
  broadcasterName: string;
  avatarUrl: string;
  href: string;
}
export function BestBroadcasterItem(props: BestBroadcasterItemProps): JSX.Element {
  const { data: nowLiveList } = useLiveShoppingNowOnLive({
    broadcasterId: props.broadcasterId,
  });
  const isNowLive = useMemo(() => {
    return nowLiveList && nowLiveList.length > 0;
  }, [nowLiveList]);
  return (
    <LinkBox outline="none">
      <Stack
        outline="none"
        textAlign="center"
        justify="center"
        align="center"
        gap={2}
        key={props.broadcasterName}
        role="group"
      >
        <Avatar
          size="2xl"
          width="100%"
          height="100%"
          maxW={{ base: 120, md: 160 }}
          maxH={{ base: 120, md: 160 }}
          src={props.avatarUrl}
          cursor="pointer"
          border={isNowLive ? '2px solid red' : undefined}
          _groupHover={{
            transition: '0.15s',
            outline: '2px solid',
            outlineColor: 'blue.400',
            outlineOffset: 2,
            boxShadow: 'xl',
          }}
          pos="relative"
          _after={
            isNowLive
              ? {
                  color: 'white',
                  backgroundColor: 'red',
                  content: '"LIVE"',
                  position: 'absolute',
                  fontSize: 'xs',
                  height: 4,
                  bottom: 2,
                  px: 2,
                  rounded: 'sm',
                  display: 'flex',
                  justify: 'center',
                }
              : undefined
          }
        />
        {props.href ? (
          <NextLink passHref href={props.href || '#'}>
            <LinkOverlay isExternal={props.href.includes('http')}>
              <Heading noOfLines={2} fontSize={['md', 'md', 'xl']}>
                {props.broadcasterName}
              </Heading>
            </LinkOverlay>
          </NextLink>
        ) : (
          <Heading noOfLines={2} fontSize="xl">
            {props.broadcasterName}
          </Heading>
        )}
      </Stack>
    </LinkBox>
  );
}
