import { Box, BoxProps, Heading } from '@chakra-ui/react';
import { KkshowMainCarouselItem } from '@project-lc/shared-types';
import { memo } from 'react';
import LiveShoppingPreviewBox from '../LiveShoppingPreviewBox';

export interface KkshowMainCarouselDescriptionProps {
  item: KkshowMainCarouselItem;
}
export function KkshowMainCarouselDescription({
  item,
}: KkshowMainCarouselDescriptionProps): JSX.Element | null {
  const KkshowMainCarouselDescriptionContainer = (props: BoxProps): JSX.Element => (
    <Box h={100} {...props} />
  );

  if (item.type === 'upcoming') {
    return (
      <KkshowMainCarouselDescriptionContainer>
        <LiveShoppingPreviewBox
          title={item.liveShoppingName}
          normalPrice={item.normalPrice}
          discountedPrice={item.discountedPrice}
          profileImageUrl={item.profileImageUrl}
          productImageUrl={item.productImageUrl}
          productLinkUrl={item.productLinkUrl}
          isExternal // item.isExternal}
        />
      </KkshowMainCarouselDescriptionContainer>
    );
  }

  if (item.type === 'nowPlaying') {
    return (
      <KkshowMainCarouselDescriptionContainer>
        <LiveShoppingPreviewBox
          title={item.liveShoppingName}
          normalPrice={item.normalPrice}
          discountedPrice={item.discountedPrice}
          profileImageUrl={item.profileImageUrl}
          productImageUrl={item.productImageUrl}
          productLinkUrl={item.productLinkUrl}
          isExternal // item.isExternal}
          isOnLive
        />
      </KkshowMainCarouselDescriptionContainer>
    );
  }

  if (item.type === 'previous') {
    return (
      <KkshowMainCarouselDescriptionContainer>
        <LiveShoppingPreviewBox
          title={item.liveShoppingName}
          normalPrice={item.normalPrice}
          discountedPrice={item.discountedPrice}
          profileImageUrl={item.profileImageUrl}
          productImageUrl={item.productImageUrl}
          productLinkUrl={item.productLinkUrl}
          isExternal // item.isExternal}
        />
      </KkshowMainCarouselDescriptionContainer>
    );
  }

  if (item.type === 'simpleBanner') {
    return (
      <KkshowMainCarouselDescriptionContainer>
        <Heading
          textAlign="center"
          fontSize={{ base: 'xl', md: '2xl' }}
          color="whiteAlpha.900"
        >
          {item.description}
        </Heading>
      </KkshowMainCarouselDescriptionContainer>
    );
  }

  return <KkshowMainCarouselDescriptionContainer />;
}

export default memo(KkshowMainCarouselDescription);
