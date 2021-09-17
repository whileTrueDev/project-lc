import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Image, Flex, IconButton, HStack } from '@chakra-ui/react';
import { useRef } from 'react';
import { useDisplaySize, useHorizontalScroll } from '@project-lc/hooks';

export interface HorizontalImageGalleryProps {
  images: string[];
}
export function HorizontalImageGallery({ images }: HorizontalImageGalleryProps) {
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
      <HStack overflowX="auto" spacing={4} ref={galleryRef} minW="100%">
        {images.map((img) => (
          <Image
            key={img}
            boxShadow="lg"
            borderRadius="xl"
            src={img}
            w={{ base: 260, sm: 300 }}
            h={{ base: 260, sm: 300 }}
          />
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
}: ChevronIconButtonProps) {
  const icon =
    direction === 'right' ? (
      <ChevronRightIcon color="black" />
    ) : (
      <ChevronLeftIcon color="black" />
    );
  return (
    <IconButton
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
