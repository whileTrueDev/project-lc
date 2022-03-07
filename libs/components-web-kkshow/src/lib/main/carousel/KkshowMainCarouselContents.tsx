import { AspectRatio, Box, BoxProps, Image } from '@chakra-ui/react';
import { KkshowMainCarousel as TKkshowMainCarousel } from '@project-lc/shared-types';
import { memo } from 'react';

export interface KkshowMainCarouselContentsProps {
  item: TKkshowMainCarousel;
}
export function KkshowMainCarouselContents({
  item,
}: KkshowMainCarouselContentsProps): JSX.Element | null {
  const KkshowMainCarouselContentsContainer = (props: BoxProps): JSX.Element => (
    <Box position="relative" h="100%" w="100%" {...props} />
  );

  if (['upcoming', 'simpleBanner'].includes(item.type))
    return (
      <KkshowMainCarouselContentsContainer>
        <AspectRatio ratio={1} maxH="100%">
          <Image src={item.imageUrl} rounded="xl" w="100%" h="100%" />
        </AspectRatio>
      </KkshowMainCarouselContentsContainer>
    );

  if (item.type === 'nowPlaying') {
    return (
      <KkshowMainCarouselContentsContainer>
        <iframe
          style={{ borderRadius: '8px' }}
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${item.videoUrl}?controls=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </KkshowMainCarouselContentsContainer>
    );
  }

  if (item.type === 'previous') {
    const youtubeSrc = item.videoUrl.includes('https://www.youtube.com/embed')
      ? item.videoUrl
      : `https://www.youtube.com/embed/${item.videoUrl}`;
    return (
      <KkshowMainCarouselContentsContainer>
        <iframe
          style={{ borderRadius: '8px' }}
          width="100%"
          height="100%"
          src={youtubeSrc}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </KkshowMainCarouselContentsContainer>
    );
  }

  return <KkshowMainCarouselContentsContainer> </KkshowMainCarouselContentsContainer>;
}

export default memo(KkshowMainCarouselContents);
