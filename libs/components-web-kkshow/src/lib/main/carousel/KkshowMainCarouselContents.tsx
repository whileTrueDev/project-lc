import { AspectRatio, Box, BoxProps, LinkBox, LinkOverlay } from '@chakra-ui/react';
import { KkshowMainCarouselItem } from '@project-lc/shared-types';
import { EmbededVideo } from '@project-lc/components-shared/EmbededVideo';
import { memo, useCallback } from 'react';
import Link from 'next/link';
import { YouTubePlayer } from 'youtube-player/dist/types';
import { useSwiper } from 'swiper/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';

export interface KkshowMainCarouselContentsProps {
  item: KkshowMainCarouselItem;
}
export function KkshowMainCarouselContents({
  item,
}: KkshowMainCarouselContentsProps): JSX.Element | null {
  const KkshowMainCarouselContentsContainer = (props: BoxProps): JSX.Element => (
    <Box position="relative" h="100%" w="100%" {...props} />
  );

  const swiper = useSwiper();

  const handleYoutubeStateChange = useCallback(
    (
      __identifier: string,
      event: { youtubePlayer: YouTubePlayer; data: 0 | 1 | 2 | 3 | 5 | -1 },
    ): void => {
      // 재생상태로 전환시
      if (event.data === 1) swiper.autoplay.stop();
      // 일시정지(2)시 or 동영상 종료시 (0)
      if (event.data === 2 || event.data === 0) swiper.autoplay.start();
    },
    [swiper.autoplay],
  );

  const handleTwitchStateChange = useCallback(
    (status: 'play' | 'pause' | 'ready' | 'ended'): void => {
      if (status === 'play') swiper.autoplay.stop();
      else swiper?.autoplay?.start();
    },
    [swiper.autoplay],
  );

  if (item.type === 'upcoming')
    return (
      <KkshowMainCarouselContentsContainer>
        <AspectRatio ratio={1} maxH="100%">
          <LinkBox rounded="xl">
            <Link href={item.productLinkUrl} passHref>
              <LinkOverlay isExternal={item.productLinkUrl.includes('http')}>
                <ChakraNextImage
                  layout="fill"
                  objectFit="contain"
                  src={item.imageUrl}
                  rounded="xl"
                  priority
                  quality={100}
                  width="100%"
                  height="100%"
                />
              </LinkOverlay>
            </Link>
          </LinkBox>
        </AspectRatio>
      </KkshowMainCarouselContentsContainer>
    );

  if (item.type === 'simpleBanner')
    return (
      <KkshowMainCarouselContentsContainer>
        <AspectRatio ratio={1} maxH="100%">
          <LinkBox rounded="xl">
            <Link href={item.linkUrl || '#'} passHref>
              <LinkOverlay isExternal={!!(item.linkUrl && item.linkUrl.includes('http'))}>
                <ChakraNextImage
                  layout="fill"
                  objectFit="contain"
                  src={item.imageUrl}
                  rounded="xl"
                  priority
                  quality={100}
                  width="100%"
                  height="100%"
                />
              </LinkOverlay>
            </Link>
          </LinkBox>
        </AspectRatio>
      </KkshowMainCarouselContentsContainer>
    );

  if (item.type === 'nowPlaying') {
    return (
      <KkshowMainCarouselContentsContainer>
        <EmbededVideo
          provider={item.platform}
          identifier={item.videoUrl}
          onYoutubeStateChange={handleYoutubeStateChange}
          onTwitchStateChange={handleTwitchStateChange}
        />
      </KkshowMainCarouselContentsContainer>
    );
  }

  if (item.type === 'previous') {
    const youtubeSrc = item.videoUrl.replace('https://youtu.be/', '');
    return (
      <KkshowMainCarouselContentsContainer>
        <EmbededVideo
          provider="youtube"
          identifier={youtubeSrc}
          onYoutubeStateChange={handleYoutubeStateChange}
        />
      </KkshowMainCarouselContentsContainer>
    );
  }

  return <KkshowMainCarouselContentsContainer> </KkshowMainCarouselContentsContainer>;
}

export default memo(KkshowMainCarouselContents);
