import { GridColumns, GridRowParams } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import { useColorModeValue, Box, Text, Divider } from '@chakra-ui/react';
import { useNoticeInfo } from '@project-lc/hooks';
import dayjs from 'dayjs';
import { Notice } from '@prisma/client';
import { ChakraDataGrid } from './ChakraDataGrid';

const columns: GridColumns = [
  {
    field: 'title',
    headerName: '제목',
    minWidth: 600,
  },
  {
    field: 'date',
    headerName: '날짜',
    valueFormatter: ({ row }) =>
      dayjs(row.postingDate as Date).format('YYYY/MM/DD HH:mm:ss'),
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

// 정산 내역을 보여주는 데이터 그리드
export function MypageNoticeSection(): JSX.Element {
  const useStyle = makeStyles({
    columnHeader: {
      backgroundColor: useColorModeValue('inherit', '#2D3748'),
    },
    root: {
      borderWidth: 0,
      color: useColorModeValue('inherit', `rgba(255, 255, 255, 0.92)`),
    },
  });

  async function handleClick(param: GridRowParams): Promise<void> {
    if (param.row.url) {
      window.open(param.row.url, '_blank');
    }
  }

  const classes = useStyle();
  const { data: notices, isLoading } = useNoticeInfo();

  return (
    <Box borderWidth="1px" borderRadius="lg" p={7} height="100%">
      <Text fontSize="lg" fontWeight="medium" pb={1}>
        공지사항
      </Text>
      <Divider backgroundColor="gray.100" mb={3} />
      <ChakraDataGrid
        classes={{
          columnHeader: classes.columnHeader,
          root: classes.root,
        }}
        loading={isLoading}
        borderWidth={0}
        headerHeight={40}
        minHeight={100}
        autoHeight
        hideFooter
        density="compact"
        columns={columns}
        rows={makeListRow(notices)}
        rowsPerPageOptions={[25, 50]}
        onRowClick={handleClick}
        rowCount={5}
        pageSize={5}
        disableColumnMenu
        disableColumnReorder
        disableMultipleColumnsSorting
        disableColumnFilter
        disableSelectionOnClick
      />
    </Box>
  );
}
