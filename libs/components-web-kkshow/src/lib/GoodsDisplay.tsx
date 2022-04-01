import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
  AspectRatio,
  Box,
  BoxProps,
  Heading,
  HeadingProps,
  Icon,
  LinkBox,
  LinkOverlay,
  Text,
} from '@chakra-ui/react';
import MotionBox from '@project-lc/components-core/MotionBox';
import { KkshowShoppingTabGoodsData } from '@project-lc/shared-types';
import { getDiscountedRate } from '@project-lc/utils-frontend';
import { HTMLMotionProps, motion } from 'framer-motion';
import Link from 'next/link';

interface GoodsDisplayDetailProps {
  goods: KkshowShoppingTabGoodsData;
  fontSize?: HeadingProps['fontSize'];
  noOfLines?: HeadingProps['noOfLines'];
}
export const GoodsDisplayDetail = ({
  goods,
  fontSize = { base: 'md', md: 'lg' },
  noOfLines = 1,
}: GoodsDisplayDetailProps): JSX.Element => (
  <Box minH={20}>
    <Heading
      fontSize={fontSize}
      fontWeight="medium"
      noOfLines={goods.discountedPrice ? noOfLines : 2}
    >
      {goods.name}
    </Heading>
    {goods.discountedPrice ? (
      <Text textDecor="line-through" color="gray.500" fontSize={{ base: 'sm', md: 'md' }}>
        {goods.normalPrice.toLocaleString()}
      </Text>
    ) : null}

    <Heading fontSize={{ base: 'md', md: 'xl' }}>
      {goods.discountedPrice && (
        <Heading as="span" color="red" fontSize={{ base: 'md', md: 'xl' }}>
          {getDiscountedRate(goods.normalPrice, goods.discountedPrice)}%
        </Heading>
      )}{' '}
      {goods.discountedPrice
        ? goods.discountedPrice.toLocaleString()
        : goods.normalPrice.toLocaleString()}
      원
    </Heading>
  </Box>
);

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
  imageProps?: HTMLMotionProps<'img'>;
}
export const GoodsDisplayImage = ({
  src,
  alt,
  ratio = 1,
  hasShadow,
  withArrowIcon = true,
  imageProps,
  ...rest
}: GoodsDisplayImageProps): JSX.Element => (
  <AspectRatio ratio={ratio}>
    <Box
      position="relative"
      maxWidth={340}
      borderRadius={rest.borderRadius || 'xl'}
      {...rest}
    >
      <motion.img
        style={{
          shadow: hasShadow ? 'md' : 'none',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        alt={alt}
        src={src}
        draggable={false}
        {...imageProps}
      />

      {withArrowIcon && <GoodsDisplayArrowIcon />}
    </Box>
  </AspectRatio>
);

export interface GoodsDisplayProps extends GoodsDisplayDetailProps {
  variant?: 'small' | 'middle' | 'card';
}
export function GoodsDisplay({
  goods,
  variant = 'small',
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

  return (
    <LinkBox>
      <MotionBox whileHover="hover">
        <GoodsDisplayImage
          alt={goods.name}
          src={goods.imageUrl}
          ratio={ratio}
          borderBottomRadius={variant === 'card' ? 'none' : undefined}
          imageProps={{
            variants: { hover: { scale: 1.05 } },
          }}
        />

        <GoodsDisplayContainer
          p={2}
          color={variant === 'card' ? 'blackAlpha.900' : undefined}
        >
          <Link href={goods.linkUrl} passHref>
            <LinkOverlay href={goods.linkUrl}>
              <GoodsDisplayDetail goods={goods} />
            </LinkOverlay>
          </Link>
        </GoodsDisplayContainer>
      </MotionBox>
    </LinkBox>
  );
}

export default GoodsDisplay;
