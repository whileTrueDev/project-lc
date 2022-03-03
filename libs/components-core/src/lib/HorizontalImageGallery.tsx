import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, ButtonProps, Flex, HStack, IconButton, theme } from '@chakra-ui/react';
import { useDisplaySize, useHorizontalScroll } from '@project-lc/hooks';
import { useRef } from 'react';
import { ChakraNextImage } from './ChakraNextImage';

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
          isInVisible={isEndOfLeft}
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
          isInVisible={!(images.length > 2 && !isEndOfRight)}
          onClick={scrollRight}
        />
      )}
    </Flex>
  );
}

export interface ChevronIconButtonProps {
  direction: 'left' | 'right';
  size?: ButtonProps['size'];
  right?: number | string;
  left?: number | string;
  bottom?: number | string;
  top?: number | string;
  isInVisible?: boolean;
  variant?: 'filled' | 'outlined';
  onClick: () => void;
}
export function ChevronIconButton({
  direction,
  right = -5,
  left = -5,
  bottom,
  top,
  size,
  isInVisible = false,
  variant = 'filled',
  onClick,
}: ChevronIconButtonProps): JSX.Element {
  const icon =
    direction === 'right' ? (
      <ChevronRightIcon
        color={variant === 'filled' ? 'black' : 'white'}
        fontSize={variant === 'filled' ? 'unset' : 'xl'}
      />
    ) : (
      <ChevronLeftIcon
        color={variant === 'filled' ? 'black' : 'white'}
        fontSize={variant === 'filled' ? 'unset' : 'xl'}
      />
    );
  const bgColor = variant === 'filled' ? 'white' : 'whiteAlpha.500';
  return (
    <IconButton
      size={size}
      zIndex={theme.zIndices.banner}
      display={isInVisible ? 'none' : 'flex'}
      right={direction === 'right' ? right : undefined}
      left={direction === 'left' ? left : undefined}
      bottom={bottom}
      top={top}
      position="absolute"
      aria-label={`image-gallery-to-${direction}`}
      _hover={{ bgColor }}
      _active={{ bgColor }}
      icon={icon}
      isRound
      onClick={onClick}
      bgColor={variant === 'filled' ? bgColor : 'transparent'}
      border={variant === 'filled' ? undefined : `solid 2px white`}
      boxShadow={variant === 'filled' ? 'dark-lg' : undefined}
    />
  );
}
