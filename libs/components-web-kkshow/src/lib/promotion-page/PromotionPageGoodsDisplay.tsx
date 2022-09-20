/* eslint-disable react/no-array-index-key */
import { Badge, Box, Flex, Text, useBoolean } from '@chakra-ui/react';
import RedLinedText from '@project-lc/components-core/RedLinedText';

import { PromotionPagePromotionGoods } from '@project-lc/shared-types';
import { getDiscountedRate, getLocaleNumber } from '@project-lc/utils-frontend';
import NextLink from 'next/link';
import { GoodsDisplayImage } from '../GoodsDisplay';

interface PromotinoPageGoodsDisplayProps {
  broadcasterId: number | string;
  item: {
    goods: {
      id: number;
      image: { image: string }[];
      summary?: string;
      goods_name: string;
      options: PromotionPagePromotionGoods['goods']['options'];
    };
  };
  isLive?: boolean;
}
export function PromotinoPageGoodsDisplay({
  broadcasterId,
  item,
  isLive,
}: PromotinoPageGoodsDisplayProps): JSX.Element | null {
  const [mouseEnter, { on, off }] = useBoolean();

  const defaultOpt = item.goods.options.find((x) => x.default_option === 'y');
  if (!defaultOpt) return null;

  const isDiscounted = defaultOpt.consumer_price > defaultOpt.price;

  return (
    <NextLink href={`/goods/${item.goods.id}?bc=${broadcasterId}`} passHref>
      <Box cursor="pointer" onMouseEnter={on} onMouseLeave={off}>
        <GoodsDisplayImage
          border={isLive ? '2px solid red' : undefined}
          alt={item.goods.goods_name}
          src={item.goods.image.find((i) => i.image)?.image || ''}
          ratio={1}
          mouseEnter={mouseEnter}
        />

        <Box py={2} px={1}>
          <Text noOfLines={2} fontSize={['sm', 'md']}>
            {isLive && (
              <Badge variant="solid" colorScheme="red" mr={1}>
                LIVE
              </Badge>
            )}
            {item.goods.goods_name}
          </Text>
          <Text
            color="GrayText"
            fontSize="sm"
            noOfLines={1}
            display={{ base: 'none', sm: 'block' }}
          >
            {item.goods.summary}
          </Text>

          <Box>
            <Flex fontSize={['sm', 'md', 'xl']} gap={2} maxW={270}>
              <Text>
                {isDiscounted ? (
                  <Text as="span" color="red" fontWeight="bold">
                    {getDiscountedRate(
                      Number(defaultOpt.consumer_price),
                      Number(defaultOpt.price),
                    )}
                    %{' '}
                  </Text>
                ) : null}
                {getLocaleNumber(defaultOpt.price)}원{' '}
                {isDiscounted ? (
                  <RedLinedText color="GrayText" as="span" fontSize={['xs', 'sm']}>
                    {getLocaleNumber(defaultOpt.consumer_price)}원
                  </RedLinedText>
                ) : null}
              </Text>
            </Flex>
          </Box>
        </Box>
      </Box>
    </NextLink>
  );
}

export default PromotinoPageGoodsDisplay;
