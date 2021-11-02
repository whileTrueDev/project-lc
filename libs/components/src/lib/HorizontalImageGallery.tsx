import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Flex, HStack, IconButton, theme } from '@chakra-ui/react';
import { useDisplaySize, useHorizontalScroll } from '@project-lc/hooks';
import { useRef } from 'react';
import { ChakraNextImage } from '..';

export interface HorizontalImageGalleryProps {
  images: string[];
}
export function HorizontalImageGallery({
  images,
}: HorizontalImageGalleryProps): JSX.Element {
  const { isMobileSize } = useDisplaySize();
  const galleryRef = useRef<HTMLDivElement>(null);
  const { isEndOfLeft, isEndOfRight, scrollLeft, scrollRight } =
    useHorizontalScroll(galleryRef);

  return (
    <Flex position="relative" alignItems="center">
      {!isMobileSize && (
        <ChevronIconButton
          direction="left"
          isVisible={!isEndOfLeft}
          onClick={scrollLeft}
        />
      )}
      <HStack spacing={4} ref={galleryRef} minW="100%" overflowX="auto" flexWrap="nowrap">
        {images.map((img) => (
          <Box key={img} flexBasis={0} flexGrow={0} whiteSpace="nowrap">
            <ChakraNextImage
              layout="fixed"
              width={isMobileSize ? 260 : 300}
              height={isMobileSize ? 260 : 300}
              boxShadow="lg"
              borderRadius="xl"
              src={img}
            />
          </Box>
        ))}
      </HStack>
      {!isMobileSize && (
        <ChevronIconButton
          direction="right"
          isVisible={images.length > 2 && !isEndOfRight}
          onClick={scrollRight}
        />
      )}
    </Flex>
  );
}

export interface ChevronIconButtonProps {
  direction: 'left' | 'right';
  isVisible?: boolean;
  onClick: () => void;
}
export function ChevronIconButton({
  direction,
  isVisible,
  onClick,
}: ChevronIconButtonProps): JSX.Element {
  const icon =
    direction === 'right' ? (
      <ChevronRightIcon color="black" />
    ) : (
      <ChevronLeftIcon color="black" />
    );
  return (
    <IconButton
      zIndex={theme.zIndices.banner}
      display={isVisible ? 'flex' : 'none'}
      right={direction === 'right' ? -5 : undefined}
      left={direction === 'left' ? -5 : undefined}
      position="absolute"
      aria-label={`image-gallery-to-${direction}`}
      _hover={{
        bgColor: 'whiteAlpha.900',
      }}
      _active={{
        bgColor: 'whiteAlpha.900',
      }}
      icon={icon}
      bgColor="whiteAlpha.900"
      isRound
      boxShadow="dark-lg"
      onClick={onClick}
    />
  );
}
