import { Button, Heading, Link, Stack, Text } from '@chakra-ui/react';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import { Manual, UserType } from '@prisma/client';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { useAdminManualList } from '@project-lc/hooks';
import NextLink from 'next/link';

export function AdminManualListHeader(): JSX.Element {
  return (
    <Stack mb={4}>
      <Stack direction="row">
        <Heading>이용안내 목록</Heading>
        <NextLink href="/general/manual/post" passHref>
          <Button as={Link} variant="link" colorScheme="blue">
            작성하기
          </Button>
        </NextLink>
      </Stack>
      <Text>* 이용안내 내용을 확인하거나 수정하려면 id 부분을 클릭해주세요</Text>
    </Stack>
  );
}

export function AdminManualListSection(): JSX.Element {
  const { data, isLoading, isError } = useAdminManualList();
  if (isLoading) return <Text>로딩중...</Text>;
  if (isError) return <Text>에러가 발생했습니다</Text>;
  if (!data) return <Text>데이터가 없습니다</Text>;

  const sellerManualList = data
    .filter((item) => item.target === UserType.seller)
    .sort((a, b) => {
      if (a.order === b.order) return a.title.localeCompare(b.title);
      return a.order - b.order;
    });
  const broadcasterManualList = data
    .filter((item) => item.target === UserType.broadcaster)
    .sort((a, b) => {
      if (a.order === b.order) return a.title.localeCompare(b.title);
      return a.order - b.order;
    });
  return (
    <Stack spacing={16}>
      <Stack>
        <Text>판매자</Text>
        <ManualList data={sellerManualList} />
      </Stack>
      <Stack>
        <Text>방송인</Text>
        <ManualList data={broadcasterManualList} />
      </Stack>
    </Stack>
  );
}

export default AdminManualListSection;

const columns: GridColumns = [
  {
    field: 'id',
    headerName: 'id',
    width: 70,
    renderCell: ({ row }: GridRowData) => {
      return (
        <NextLink href={`manual/${row.id}`} passHref>
          <Link color="blue.500">{row.id}</Link>
        </NextLink>
      );
    },
  },
  { field: 'title', headerName: '주제', flex: 1 },
  { field: 'description', headerName: '간략 설명', flex: 1 },
  { field: 'order', headerName: '순서' },
  { field: 'createDate', headerName: '생성일', flex: 1 },
  { field: 'updateDate', headerName: '수정일', flex: 1 },
];

export function ManualList({ data }: { data: Manual[] }): JSX.Element {
  return (
    <ChakraDataGrid
      borderWidth={0}
      hideFooter
      headerHeight={50}
      autoHeight
      density="compact"
      rows={data || []}
      columns={columns}
      disableColumnMenu
      disableColumnFilter
      disableSelectionOnClick
    />
  );
}
