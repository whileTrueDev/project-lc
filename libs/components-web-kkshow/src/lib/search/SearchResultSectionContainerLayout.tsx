import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react';

export interface SearchResultSectionContainerProps {
  title: string;
  resultCount?: number;
  children: React.ReactNode;
  actionButton?: React.ReactNode;
}
/** 상품, 라이브컨텐츠, 크리에이터 영역 레이아웃 컴포넌트 */
export function SearchResultSectionContainerLayout({
  title,
  resultCount,
  children,
  actionButton,
}: SearchResultSectionContainerProps): JSX.Element {
  return (
    <Box>
      <Container maxW="6xl" px={6}>
        <Stack py={12} spacing={8}>
          <Stack direction="row" justify="space-between" fontWeight="bold" width="100%">
            <Stack direction="row" alignItems="flex-end">
              <Heading color="blue.500" fontSize={{ base: 'xl', sm: '2xl', md: '3xl' }}>
                {title}
              </Heading>
              {resultCount && <Text>{resultCount}개의 검색결과</Text>}
            </Stack>

            {actionButton && <Box alignSelf="flex-end">{actionButton}</Box>}
          </Stack>
          <Box>{children}</Box>
        </Stack>
      </Container>
    </Box>
  );
}

export function SearchResultEmptyText(): JSX.Element {
  return <Text fontSize={{ base: 'sm', sm: 'md' }}>검색 결과가 없습니다.</Text>;
}

export function SeeMoreButton({ onClick }: { onClick: () => void }): JSX.Element {
  return (
    <Button variant="link" colorScheme="blue" onClick={onClick}>
      더보기
    </Button>
  );
}
