import { Box, BoxProps, Fade, Flex } from '@chakra-ui/react';
import { ChevronIconButton } from '@project-lc/components-core/HorizontalImageGallery';

export interface SwiperSlideItemProps {
  children: React.ReactNode;
  isActive: boolean;
  onSlidePrev?: () => void;
  onSlideNext?: () => void;
  containerProps?: BoxProps;
}
export function SwiperSlideItem({
  children,
  isActive,
  onSlidePrev,
  onSlideNext,
  containerProps,
}: SwiperSlideItemProps): JSX.Element {
  return (
    <Flex
      h="100%"
      mx={{ base: 2, md: 4 }}
      gap={4}
      flexDir="column"
      justify="flex-start"
      position="relative"
      {...containerProps}
    >
      {children}
      <Fade in={isActive} unmountOnExit>
        <Box display={{ base: 'none', md: 'contents' }} transition="display 0.2s">
          {onSlidePrev && (
            <ChevronIconButton
              variant="outlined"
              direction="left"
              left={{ md: -55, xl: -100 }}
              bottom="50%"
              onClick={onSlidePrev}
            />
          )}

          {onSlideNext && (
            <ChevronIconButton
              variant="outlined"
              direction="right"
              right={{ md: -55, xl: -100 }}
              bottom="50%"
              onClick={onSlideNext}
            />
          )}
        </Box>
      </Fade>
    </Flex>
  );
}

export default SwiperSlideItem;
