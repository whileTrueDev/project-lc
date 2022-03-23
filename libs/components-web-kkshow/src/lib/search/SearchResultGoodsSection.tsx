import { Image, LinkBox, LinkOverlay, Stack, Text } from '@chakra-ui/react';
import { SearchResultItem } from '@project-lc/shared-types';
import NextLink from 'next/link';
import {
  SearchResultEmptyText,
  SearchResultSectionContainer,
} from './SearchResultSectionContainer';

/** 검색결과 - 상품아이템 => 쇼핑탭에서 작성한 상품컴포넌트와 비슷할듯하다 => 확인 후 수정필요
 */
function GoodsCard({ item }: { item: SearchResultItem }): JSX.Element {
  return (
    <LinkBox>
      <NextLink href={item.linkUrl} passHref>
        <LinkOverlay isExternal={item.linkUrl.includes('http')}>
          <Stack w={{ base: '132px', sm: '260px' }}>
            <Image src={item.imageUrl} rounded="xl" objectFit="cover" />
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
