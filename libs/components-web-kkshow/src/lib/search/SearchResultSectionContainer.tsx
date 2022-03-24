import { Box, Text, Heading, Stack, Container, Button } from '@chakra-ui/react';

/** 상품, 라이브컨텐츠, 크리에이터 영역 레이아웃 컴포넌트 */
export function SearchResultSectionContainer({
  title,
  resultCount,
  children,
  seeMoreButtonHandler,
}: {
  title: string;
  resultCount?: number;
  children: React.ReactNode;
  seeMoreButtonHandler?: () => void;
}): JSX.Element {
  return (
    <Box>
      <Container maxW="6xl">
        <Stack py={8}>
          <Stack direction="row" justify="space-between" fontWeight="bold" width="100%">
            <Stack direction="row" alignItems="flex-end">
              <Heading color="blue.500" fontSize="3xl">
                {title}
              </Heading>
              {resultCount && <Text>{resultCount}개의 검색결과</Text>}
            </Stack>

            <Box alignSelf="flex-end">
              <Button colorScheme="blue" variant="link" onClick={seeMoreButtonHandler}>
                더보기
              </Button>
            </Box>
          </Stack>
          <Box>{children}</Box>
        </Stack>
      </Container>
    </Box>
  );
}

export function SearchResultEmptyText(): JSX.Element {
  return <Text>검색 결과가 없습니다</Text>;
}
