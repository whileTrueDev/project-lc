import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
  AspectRatio,
  Box,
  BoxProps,
  Heading,
  HeadingProps,
  Icon,
  Text,
  useBoolean,
} from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { KkshowShoppingTabGoodsData } from '@project-lc/shared-types';
import { getDiscountedRate, getLocaleNumber } from '@project-lc/utils-frontend';
import NextLink from 'next/link';
import { useMemo } from 'react';

export interface GoodsDisplayDetailProps {
  goods: Pick<KkshowShoppingTabGoodsData, 'discountedPrice' | 'normalPrice' | 'name'>;
  fontSize?: HeadingProps['fontSize'];
  noOfLines?: HeadingProps['noOfLines'];
}
export const GoodsDisplayDetail = ({
  goods,
  fontSize = { base: 'md', md: 'lg' },
  noOfLines = 2,
}: GoodsDisplayDetailProps): JSX.Element => {
  const isDiscounted = useMemo(() => {
    if (!goods.discountedPrice) return false;
    if (goods.discountedPrice === goods.normalPrice) return false;
    return true;
  }, [goods.discountedPrice, goods.normalPrice]);
  return (
    <Box minH={20}>
      <Heading
        fontSize={fontSize}
        fontWeight="normal"
        noOfLines={isDiscounted ? noOfLines : 2}
      >
        {goods.name}
      </Heading>
      {isDiscounted ? (
        <Text
          textDecor="line-through"
          color="gray.500"
          fontSize={{ base: 'sm', md: 'md' }}
        >
          {getLocaleNumber(goods.normalPrice)}
        </Text>
      ) : null}

      <Heading fontSize={{ base: 'md', md: 'xl' }}>
        {isDiscounted && goods.discountedPrice ? (
          <Heading as="span" color="red" fontSize={{ base: 'md', md: 'xl' }}>
            {getDiscountedRate(goods.normalPrice, goods.discountedPrice)}%
          </Heading>
        ) : null}{' '}
        {isDiscounted
          ? getLocaleNumber(goods.discountedPrice)
          : getLocaleNumber(goods.normalPrice)}
        원
      </Heading>
    </Box>
  );
};

export const GoodsDisplayArrowIcon = (): JSX.Element => (
  <Icon
    as={ArrowForwardIcon}
    position="absolute"
    right={2}
    bottom={2}
    color="white"
    rounded="full"
    bg="blackAlpha.400"
    p={1}
    boxSize="2em"
  />
);

interface GoodsDisplayImageProps extends BoxProps {
  src: string;
  ratio?: number;
  alt?: string;
  hasShadow?: boolean;
  withArrowIcon?: boolean;
  mouseEnter?: boolean;
}
export const GoodsDisplayImage = ({
  src,
  alt,
  ratio = 1,
  hasShadow,
  withArrowIcon = true,
  mouseEnter = false,
  ...rest
}: GoodsDisplayImageProps): JSX.Element => {
  return (
    <AspectRatio ratio={ratio}>
      <Box
        maxWidth={{ base: 'unset', md: 340 }}
        borderRadius={rest.borderRadius || 'xl'}
        {...rest}
      >
        <ChakraNextImage
          layout="fill"
          shadow={hasShadow ? 'md' : 'none'}
          objectFit="cover"
          alt={alt}
          src={src}
          draggable={false}
          style={{
            transition: 'all 0.5s ease',
            transform: mouseEnter ? 'scale(1.05)' : undefined,
          }}
        />

        {withArrowIcon && <GoodsDisplayArrowIcon />}
      </Box>
    </AspectRatio>
  );
};

export interface GoodsDisplayProps extends GoodsDisplayDetailProps {
  goods: KkshowShoppingTabGoodsData;
  variant?: 'small' | 'middle' | 'card';
  detailProps?: Omit<GoodsDisplayDetailProps, 'goods'>;
}
export function GoodsDisplay({
  goods,
  variant = 'small',
  detailProps,
}: GoodsDisplayProps): JSX.Element {
  const borderRadius = 'xl';

  let ratio = 1;
  switch (variant) {
    case 'middle':
      ratio = 1.5 / 1;
      break;
    case 'card':
      ratio = 1.2 / 1;
      break;
    default:
      break;
  }

  const GoodsDisplayContainer = (props: BoxProps): JSX.Element => {
    if (variant === 'card')
      return (
        <Box
          {...props}
          bgColor="whiteAlpha.900"
          borderBottomRadius={borderRadius}
          py={6}
          px={4}
          shadow="lg"
        />
      );
    return <Box {...props} />;
  };

  const [mouseEnter, { on, off }] = useBoolean();

  return (
    <NextLink href={goods.linkUrl}>
      <Box cursor="pointer" onMouseEnter={on} onMouseLeave={off}>
        <GoodsDisplayImage
          alt={goods.name}
          src={goods.imageUrl}
          ratio={ratio}
          borderBottomRadius={variant === 'card' ? 'none' : undefined}
          mouseEnter={mouseEnter}
        />

        <GoodsDisplayContainer
          p={2}
          color={variant === 'card' ? 'blackAlpha.900' : undefined}
        >
          <GoodsDisplayDetail goods={goods} {...detailProps} />
        </GoodsDisplayContainer>
      </Box>
    </NextLink>
  );
}

export default GoodsDisplay;
