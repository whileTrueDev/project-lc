import {
  Box,
  Button,
  Divider,
  Flex,
  Switch,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { GridCellParams, GridColumns, GridRowData } from '@material-ui/data-grid';
import { Notice, NoticeTarget } from '@prisma/client';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import {
  useDeleteNoticeMutation,
  useNoticeFlagMutation,
  useNoticeInfo,
} from '@project-lc/hooks';
import dayjs from 'dayjs';
import { AdminNoticeDialog } from './AdminNoticeDialog';

const noticeTargetKr: Record<NoticeTarget, string> = {
  all: '전체',
  seller: '판매자',
  broadcaster: '방송인',
  customer: '소비자',
};

const columns = (
  handleChange: any,
  handleDelete: (id: number) => Promise<void>,
): GridColumns => {
  return [
    {
      field: 'id',
      headerName: 'id',
      width: 30,
    },
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
      field: 'target',
      headerName: '대상',
      minWidth: 80,
      valueFormatter: ({ row }) => noticeTargetKr[row.target as NoticeTarget],
    },
    {
      field: 'title',
      headerName: '제목',
      minWidth: 400,
    },
    {
      field: 'date',
      headerName: '포스팅 한 날짜',
      valueFormatter: ({ row }) =>
        dayjs(row.postingDate as Date).format('YYYY/MM/DD HH:mm:ss'),
      minWidth: 200,
    },
    {
      field: 'delete',
      headerName: '삭제하기',
      width: 120,
      renderCell: ({ row }) => (
        <Button
          size="xs"
          onClick={() => {
            if (window.confirm(`공지사항 ${row.title} 를 삭제하시겠습니까?`)) {
              handleDelete(row.id);
            }
          }}
        >
          목록에서 삭제
        </Button>
      ),
      sortable: false,
    },
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

// 관리자페이지의 공지사항을 보여주는 영역
export function AdminNoticeSection(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { data: notices, isLoading } = useNoticeInfo({}, 'admin');
  const mutation = useNoticeFlagMutation();

  const handleClick = async (param: GridCellParams): Promise<void> => {
    if (param.field === 'title') {
      if (param.row.url) {
        window.open(param.row.url, '_blank');
      }
    }
  };

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

  // 공지사항 삭제
  const { mutateAsync: deleteNotice } = useDeleteNoticeMutation();
  const onDeleteSuccess = (): void => {
    toast({ title: '공지사항 삭제 완료', status: 'success' });
  };
  const onDeleteFail = (): void => {
    toast({ title: '공지사항 삭제 실패', status: 'error' });
  };
  const handleDelete = async (id: number): Promise<void> => {
    return deleteNotice(id)
      .then((res) => {
        if (!res) onDeleteFail();
        else onDeleteSuccess();
      })
      .catch((err) => {
        console.log(err);
        onDeleteFail();
      });
  };
  return (
    <Box borderWidth="1px" borderRadius="lg" p={7} height="100%">
      <Text fontSize="lg" fontWeight="medium" pb={1}>
        공지사항
      </Text>
      <Divider backgroundColor="gray.100" />
      <ChakraDataGrid
        loading={isLoading}
        borderWidth={0}
        headerHeight={40}
        minHeight={100}
        autoHeight
        // hideFooter
        density="compact"
        columns={columns(handleFlagChange, handleDelete)}
        rows={makeListRow(notices)}
        rowsPerPageOptions={[25, 50]}
        onCellClick={handleClick}
        pageSize={25}
        pagination
        disableColumnMenu
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
