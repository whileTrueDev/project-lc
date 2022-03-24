import { Button, Center, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  SearchResultSectionContainerLayout,
  SearchResultSectionContainerProps,
} from './SearchResultSectionContainerLayout';

/** 더보기 페이지에서 사용하는 페이지네이션 state */
export function useSeeMorePageState<T>({
  data,
  itemPerPage,
}: {
  data: T[];
  itemPerPage: number;
}): {
  page: number;
  dataToDisplay: T[];
  hasMore: boolean;
  handleLoadMore?: () => void;
} {
  const [page, setPage] = useState<number>(1);
  // 한 페이지에 몇개의 아이템 표시할것인지
  const dataToDisplay = data.slice(0, page * itemPerPage);

  const hasMore = data.length > page * itemPerPage;
  const handleLoadMore = hasMore ? () => setPage((prev) => prev + 1) : undefined;

  return {
    page,
    dataToDisplay,
    hasMore,
    handleLoadMore,
  };
}

export interface SeeMorePageLayoutProps extends SearchResultSectionContainerProps {
  children: React.ReactNode;
  handleLoadMore?: () => void;
}
/** 통합검색페이지에서 영역별 '더보기' 눌렀을때 이동하는 더보기페이지 레이아웃 */
export function SeeMorePageLayout({
  title,
  resultCount,
  handleLoadMore,
  children,
}: SeeMorePageLayoutProps): JSX.Element {
  const router = useRouter();
  return (
    <SearchResultSectionContainerLayout
      title={title}
      resultCount={resultCount || 0}
      actionButton={
        <Button variant="link" onClick={() => router.back()}>
          돌아가기
        </Button>
      }
    >
      <Stack>
        {children}
        {handleLoadMore && (
          <Center>
            <Button onClick={handleLoadMore}>더보기</Button>
          </Center>
        )}
      </Stack>
    </SearchResultSectionContainerLayout>
  );
}

export default SeeMorePageLayout;
