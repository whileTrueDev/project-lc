import {
  AspectRatio,
  Box,
  BoxProps,
  Heading,
  Image,
  LinkBox,
  LinkOverlay,
  Text,
} from '@chakra-ui/react';
import { KkshowShoppingTabGoodsData } from '@project-lc/shared-types';
import Link from 'next/link';
import { useMemo } from 'react';

export interface GoodsDisplayProps {
  goods: KkshowShoppingTabGoodsData;
  variant?: 'small' | 'middle' | 'card';
}
export function GoodsDisplay({
  goods,
  variant = 'small',
}: GoodsDisplayProps): JSX.Element {
  const borderRadius = '2xl';
  const discountRate = useMemo((): string => {
    return (
      ((goods.normalPrice - goods.discountedPrice) / goods.normalPrice) *
      100
    ).toFixed(0);
  }, [goods.discountedPrice, goods.normalPrice]);

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
          shadow="xl"
        />
      );
    return <Box {...props} />;
  };

  return (
    <LinkBox>
      <AspectRatio ratio={ratio}>
        <Image
          borderRadius={borderRadius}
          borderBottomRadius={variant === 'card' ? 'none' : undefined}
          shadow={variant === 'card' ? 'none' : 'md'}
          w="100%"
          h="100%"
          src={goods.imageUrl}
        />
      </AspectRatio>

      <GoodsDisplayContainer
        p={2}
        color={variant === 'card' ? 'blackAlpha.900' : undefined}
      >
        <Link href={goods.linkUrl} passHref>
          <LinkOverlay href={goods.linkUrl}>
            <Heading fontSize="lg" fontWeight="medium" noOfLines={1}>
              {goods.name}
            </Heading>
          </LinkOverlay>
        </Link>
        <Text textDecor="line-through" color="gray.500">
          {goods.normalPrice.toLocaleString()}
        </Text>
        <Heading fontSize="xl">
          <Heading as="span" color="red" fontSize="xl">
            {discountRate}%
          </Heading>{' '}
          {goods.discountedPrice.toLocaleString()}원
        </Heading>
      </GoodsDisplayContainer>
    </LinkBox>
  );
}

export default GoodsDisplay;
