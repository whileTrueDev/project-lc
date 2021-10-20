import { GridColumns, GridCellParams, GridRowData } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import {
  useColorModeValue,
  Box,
  Text,
  Switch,
  Button,
  Flex,
  useDisclosure,
  useToast,
  Divider,
  Stack,
} from '@chakra-ui/react';
import { useNoticeInfo, useNoticeFlagMutation } from '@project-lc/hooks';
import dayjs from 'dayjs';
import { Notice } from '@prisma/client';
import { ChakraDataGrid } from '../ChakraDataGrid';
import { AdminNoticeDialog } from './AdminNoticeDialog';

const columns = (handleChange: any): GridColumns => {
  return [
    {
      field: 'posting',
      headerName: '포스팅하기',
      minWidth: 120,
      renderCell: ({ row }) => {
        return (
          <Switch
            size="md"
            defaultChecked={row.postingFlag}
            onChange={handleChange(row)}
          />
        );
      },
    },
    {
      field: 'title',
      headerName: '제목',
      minWidth: 800,
    },
    {
      field: 'date',
      headerName: '날짜',
      valueFormatter: ({ row }) =>
        dayjs(row.postingDate as Date).format('YYYY/MM/DD HH:mm:ss'),
      minWidth: 200,
    },
    // {
    //   field: 'delete',
    //   headerName: '지우기',
    //   width: 120,
    //   renderCell: () => <Button size="xs">리스트에서 지우기</Button>,
    //   sortable: false,
    // },
  ];
};

function makeListRow(notices: Notice[] | undefined): Notice[] {
  if (!notices) {
    return [];
  }
  return notices.map((element) => {
    return { ...element, isRowSelectable: false };
  });
}

// 정산 내역을 보여주는 데이터 그리드
export function AdminNoticeSection(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { data: notices, isLoading } = useNoticeInfo({}, 'admin');
  const mutation = useNoticeFlagMutation();

  const classes = makeStyles({
    columnHeader: {
      backgroundColor: useColorModeValue('inherit', '#2D3748'),
    },
    root: {
      borderWidth: 0,
      color: useColorModeValue('inherit', `rgba(255, 255, 255, 0.92)`),
    },
  })();

  async function handleClick(param: GridCellParams): Promise<void> {
    if (param.field === 'title') {
      if (param.row.url) {
        window.open(param.row.url, '_blank');
      }
    }
  }

  // 포스팅 버튼을 눌렀을 때,
  const handleFlagChange =
    (row: GridRowData) =>
    async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
      try {
        await mutation.mutateAsync({
          id: row.id,
          postingFlag: e.target.checked,
        });
        toast({
          title: e.target.checked
            ? '공지사항이 포스팅 되었습니다.'
            : '공지사항 글이 내려졌습니다.',
          status: 'success',
        });
        onClose();
      } catch (error) {
        toast({
          title: '공지사항의 상태 변경이 실패하였습니다.',
          status: 'error',
        });
      }
    };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={7} height="100%">
      <Text fontSize="lg" fontWeight="medium" pb={1}>
        공지사항
      </Text>
      <Divider backgroundColor="gray.100" />
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
        columns={columns(handleFlagChange)}
        rows={makeListRow(notices)}
        rowsPerPageOptions={[25, 50]}
        onCellClick={handleClick}
        rowCount={5}
        pageSize={5}
        disableColumnMenu
        disableColumnReorder
        disableMultipleColumnsSorting
        disableColumnFilter
        disableSelectionOnClick
        components={{
          Toolbar: () => (
            <Flex direction="row" justify="flex-end">
              <Button
                size="sm"
                onClick={() => {
                  onOpen();
                }}
              >
                공지사항 등록하기
              </Button>
            </Flex>
          ),
        }}
      />
      <AdminNoticeDialog isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
