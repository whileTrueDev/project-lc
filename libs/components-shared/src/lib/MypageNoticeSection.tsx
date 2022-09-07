import { Box, Link, Text } from '@chakra-ui/react';
import { GridColumns } from '@material-ui/data-grid';
import { Notice } from '@prisma/client';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { useNoticeInfo } from '@project-lc/hooks';
import dayjs from 'dayjs';

const columns: GridColumns = [
  {
    field: 'title',
    headerName: '제목',
    flex: 3,
    renderCell: ({ row }) => {
      return (
        <Link isExternal href={row.url}>
          {row.title}
        </Link>
      );
    },
  },
  {
    field: 'date',
    headerName: '날짜',
    valueFormatter: ({ row }) =>
      dayjs(row.postingDate as Date).format('YYYY/MM/DD HH:mm:ss'),
    flex: 1,
    minWidth: 200,
  },
];

function makeListRow(notices: Notice[] | undefined): Notice[] {
  if (!notices) {
    return [];
  }
  return notices.map((element, index: number) => {
    return { ...element, id: index, isRowSelectable: false };
  });
}

// 마이페이지 - 홈의 공지사항을 보여주는 영역
export function MypageNoticeSection(): JSX.Element {
  const { data: notices, isLoading } = useNoticeInfo();

  return (
    <Box borderWidth="1px" borderRadius="lg" p={7} height="100%">
      <Text fontSize="lg" fontWeight="medium" pb={1}>
        공지사항
      </Text>
      <ChakraDataGrid
        mt={3}
        loading={isLoading}
        borderWidth={0}
        headerHeight={40}
        minHeight={100}
        autoHeight
        density="compact"
        columns={columns}
        rows={makeListRow(notices)}
        rowsPerPageOptions={[25, 50]}
        pageSize={5}
        disableColumnMenu
        disableColumnFilter
        disableSelectionOnClick
      />
    </Box>
  );
}
