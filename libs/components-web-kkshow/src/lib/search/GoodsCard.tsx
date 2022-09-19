import { Box, Stack, Text, useBoolean } from '@chakra-ui/react';
import { SearchResultItem } from '@project-lc/shared-types';
import NextLink from 'next/link';
import { GoodsDisplayImage } from '../GoodsDisplay';

/** 검색결과 - 상품아이템
 */
export function GoodsCard({ item }: { item: SearchResultItem }): JSX.Element {
  const [mouseEnter, { on, off }] = useBoolean();
  return (
    <NextLink href={item.linkUrl} passHref>
      <Box cursor="pointer" onMouseEnter={on} onMouseLeave={off}>
        <Stack>
          <GoodsDisplayImage rounded="xl" src={item.imageUrl} mouseEnter={mouseEnter} />
          <Text fontFamily="Gmarket Sans" textAlign="center">
            {item.title}
          </Text>
        </Stack>
      </Box>
    </NextLink>
  );
}
