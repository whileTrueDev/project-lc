import {
  AspectRatio,
  Box,
  BoxProps,
  Heading,
  HeadingProps,
  Image,
  LinkBox,
  LinkOverlay,
  Text,
} from '@chakra-ui/react';
import { KkshowShoppingTabGoodsData } from '@project-lc/shared-types';
import { getDiscountedRate } from '@project-lc/utils-frontend';
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

export interface GoodsDisplayProps extends GoodsDisplayDetailProps {
  variant?: 'small' | 'middle' | 'card';
}
export function GoodsDisplay({
  goods,
  variant = 'small',
}: GoodsDisplayProps): JSX.Element {
  const borderRadius = '2xl';

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
            <GoodsDisplayDetail goods={goods} />
          </LinkOverlay>
        </Link>
      </GoodsDisplayContainer>
    </LinkBox>
  );
}

export default GoodsDisplay;
