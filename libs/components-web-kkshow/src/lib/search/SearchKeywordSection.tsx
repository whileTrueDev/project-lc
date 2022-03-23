import { Box, Center, Container, Heading, Stack, Text } from '@chakra-ui/react';
import { SearchResult } from '@project-lc/shared-types';
import React from 'react';

function SearchKeywordSectionContainer({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <Box bg="blue.500" color="whiteAlpha.900">
      <Container maxW="6xl">
        <Center py={8}>{children}</Center>
      </Container>
    </Box>
  );
}

export interface SearchKeywordSectionProps {
  keyword?: string;
  result: SearchResult;
}
export function SearchKeywordSection({
  keyword,
  result,
}: SearchKeywordSectionProps): JSX.Element {
  const resultCount =
    result.broadcasters.length + result.goods.length + result.liveContents.length;

  if (!keyword || !resultCount) {
    return (
      <SearchKeywordSectionContainer>
        <Stack fontSize="lg" fontWeight="bold" textAlign="center">
          <Text>검색 결과가 없습니다.</Text>
          <Text>제품이나 방송인을 검색해보세요.</Text>
        </Stack>
      </SearchKeywordSectionContainer>
    );
  }
  return (
    <SearchKeywordSectionContainer>
      <Stack textAlign="center">
        <Heading fontSize="4xl">{`‘${keyword}’`}</Heading>
        <Text>{resultCount} 개의 결과</Text>
      </Stack>
    </SearchKeywordSectionContainer>
  );
}

export default SearchKeywordSection;
