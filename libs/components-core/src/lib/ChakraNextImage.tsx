import { chakra, forwardRef } from '@chakra-ui/react';
import Image from 'next/image';
import { ComponentProps } from 'react';

export const ChakraNextImageBase = chakra(Image, {
  shouldForwardProp: (prop) =>
    [
      'width',
      'height',
      'src',
      'alt',
      'layout',
      'quality',
      'sizes',
      'loader',
      'priority',
      'placeholder',
      'objectFit',
      'objectPosition',
      'blurDataURL',
      'lazyBoundray',
      'lazyRoot',
    ].includes(prop),
});

export const ChakraNextImage = forwardRef<
  ComponentProps<typeof ChakraNextImageBase>,
  typeof ChakraNextImageBase
>((props, ref) => <ChakraNextImageBase {...props} ref={ref} />);
