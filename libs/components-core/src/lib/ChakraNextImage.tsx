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
      'style', // 대부분 스타일 적용은 chakra style props로 전달하므로, 스타일 적용 위한 style prop은 NextImage 컴포넌트로 전달
    ].includes(prop),
});

export const ChakraNextImage = forwardRef<
  ComponentProps<typeof ChakraNextImageBase>,
  typeof ChakraNextImageBase
>((props, ref) => <ChakraNextImageBase {...props} ref={ref} />);
