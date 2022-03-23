import { Box, Text, Heading, Stack, Container } from '@chakra-ui/react';

/** 상품, 라이브컨텐츠, 크리에이터 영역 레이아웃 컴포넌트 */
export function SearchResultSectionContainer({
  title,
  resultCount,
  children,
}: {
  title: string;
  resultCount?: number;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <Box>
      <Container maxW="6xl">
        <Stack py={8}>
          <Stack direction="row" alignItems="flex-end" fontWeight="bold">
            <Heading color="blue.500" fontSize="3xl">
              {title}
            </Heading>
            {resultCount && <Text>{resultCount}개의 검색결과</Text>}
          </Stack>
          <Box>{children}</Box>
        </Stack>
      </Container>
    </Box>
  );
}
