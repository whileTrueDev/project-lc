import { Box, LinkBox, LinkOverlay, Stack, Text, useBoolean } from '@chakra-ui/react';
import { SearchResultItem } from '@project-lc/shared-types';
import { motion } from 'framer-motion';
import NextLink from 'next/link';
import {
  SearchResultEmptyText,
  SearchResultSectionContainer,
} from './SearchResultSectionContainer';

const variants = {
  scale: { scale: 1.1 },
  normal: { scale: 1.0 },
};

/** 검색결과 - 상품아이템 => 쇼핑탭에서 작성한 상품컴포넌트와 비슷할듯하다 => 확인 후 수정필요
 */
function GoodsCard({ item }: { item: SearchResultItem }): JSX.Element {
  const [mouseOver, setMouseOver] = useBoolean(false);
  return (
    <LinkBox onMouseOver={setMouseOver.on} onMouseOut={setMouseOver.off}>
      <NextLink href={item.linkUrl} passHref>
        <LinkOverlay isExternal={item.linkUrl.includes('http')}>
          <Stack w={{ base: '132px', sm: '260px' }}>
            <Box rounded="xl" overflow="hidden">
              <motion.img
                src={item.imageUrl}
                initial="normal"
                animate={mouseOver ? 'scale' : 'normal'}
                variants={variants}
                style={{ objectFit: 'cover' }}
              />
            </Box>
            <Text fontFamily="Gmarket Sans" textAlign="center">
              {item.title}
            </Text>
          </Stack>
        </LinkOverlay>
      </NextLink>
    </LinkBox>
  );
}

export interface SearchResultGoodsSectionProps {
  data: SearchResultItem[];
}
export function SearchResultGoodsSection({
  data,
}: SearchResultGoodsSectionProps): JSX.Element {
  return (
    <SearchResultSectionContainer title="상품" resultCount={data.length}>
      {data.length > 0 ? (
        <Stack direction="row" flexWrap="wrap">
          {data.map((item) => (
            <GoodsCard key={item.title} item={item} />
          ))}
        </Stack>
      ) : (
        <SearchResultEmptyText />
      )}
    </SearchResultSectionContainer>
  );
}

export default SearchResultGoodsSection;
