import { AspectRatio, Box, BoxProps, Image } from '@chakra-ui/react';
import { KkshowMainCarouselItem } from '@project-lc/shared-types';
import { EmbededVideo } from '@project-lc/components-shared/EmbededVideo';
import { memo } from 'react';

export interface KkshowMainCarouselContentsProps {
  item: KkshowMainCarouselItem;
}
export function KkshowMainCarouselContents({
  item,
}: KkshowMainCarouselContentsProps): JSX.Element | null {
  const KkshowMainCarouselContentsContainer = (props: BoxProps): JSX.Element => (
    <Box position="relative" h="100%" w="100%" {...props} />
  );

  if (item.type === 'upcoming')
    return (
      <KkshowMainCarouselContentsContainer>
        <AspectRatio ratio={1} maxH="100%">
          <Image src={item.imageUrl} rounded="xl" w="100%" h="100%" />
        </AspectRatio>
      </KkshowMainCarouselContentsContainer>
    );

  if (item.type === 'simpleBanner')
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
        <EmbededVideo provider={item.platform} identifier={item.videoUrl} />
      </KkshowMainCarouselContentsContainer>
    );
  }

  if (item.type === 'previous') {
    const youtubeSrc = item.videoUrl.replace('https://youtu.be/', '');
    return (
      <KkshowMainCarouselContentsContainer>
        <EmbededVideo provider="youtube" identifier={youtubeSrc} />
      </KkshowMainCarouselContentsContainer>
    );
  }

  return <KkshowMainCarouselContentsContainer> </KkshowMainCarouselContentsContainer>;
}

export default memo(KkshowMainCarouselContents);
