import { Box, Center, Container, Heading, Stack, Text } from '@chakra-ui/react';
import React from 'react';

function SearchKeywordSectionContainer({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <Box bg="blue.500" color="whiteAlpha.900">
      <Container maxW="6xl">
        <Center py={{ base: 4, md: 8 }}>{children}</Center>
      </Container>
    </Box>
  );
}

export interface SearchKeywordSectionProps {
  keyword?: string;
  resultCount?: number;
}
export function SearchKeywordSection({
  keyword,
  resultCount,
}: SearchKeywordSectionProps): JSX.Element {
  const renderKeyword = (
    <Heading fontSize={{ base: 'lg', md: '4xl' }}>{`‘${keyword}’`}</Heading>
  );

  if (!keyword || !resultCount) {
    return (
      <SearchKeywordSectionContainer>
        <Stack fontWeight="medium" textAlign="center">
          {keyword ? renderKeyword : null}
          <Text fontSize={{ base: 'sm', sm: 'md' }}>검색 결과가 없습니다.</Text>
          <Text fontSize={{ base: 'sm', sm: 'md' }}>
            {keyword && '다른 '}제품이나 방송인을 검색해보세요.
          </Text>
        </Stack>
      </SearchKeywordSectionContainer>
    );
  }
  return (
    <SearchKeywordSectionContainer>
      <Stack textAlign="center" fontWeight="medium">
        {renderKeyword}
        <Text>{resultCount} 개의 결과</Text>
      </Stack>
    </SearchKeywordSectionContainer>
  );
}

export default SearchKeywordSection;
