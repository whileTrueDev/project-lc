import { Select, Button, Box, useToast } from '@chakra-ui/react';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import { AdminType } from '@prisma/client';
import {
  useDisplaySize,
  useAdminManagerList,
  useChangeAdminClassMutation,
  useProfile,
  useDeleteAdminUserMutation,
  AdminClassDtoId,
} from '@project-lc/hooks';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { AdminClassBadge } from '@project-lc/components-admin/AdminClassBadge';
import { useQueryClient } from 'react-query';
import { useRouter } from 'next/router';

// 가입된 모든 관리자 계정
export function AdminManagerList(): JSX.Element {
  const { isDesktopSize } = useDisplaySize();
  const { data: profile, isLoading: profileIsLoading } = useProfile();
  const { data, isLoading } = useAdminManagerList();

  const toast = useToast();
  const queryClient = useQueryClient();

  const { mutateAsync } = useChangeAdminClassMutation();
  const { mutateAsync: deleteMutateAsync } = useDeleteAdminUserMutation();

  const router = useRouter();

  async function handleSelectBox(adminClass: AdminType): Promise<void> {
    mutateAsync({ email: profile?.email || '', adminClass }).then(() => {
      queryClient.invalidateQueries('getAdminManagerList');
      toast({
        title: '변경완료',
      });
    });
  }

  async function handleDeleteButton(userId: AdminClassDtoId): Promise<void> {
    deleteMutateAsync(userId).then(() => {
      toast({
        title: '삭제완료',
      });
    });
  }

  const columns: GridColumns = [
    { field: 'id', width: 90 },
    {
      field: 'email',
      headerName: '이메일',
    },
    {
      field: 'adminClass',
      headerName: '권한등급',
      renderCell: ({ row }: GridRowData) => (
        <AdminClassBadge adminClass={row.adminClass} lineHeight={2} />
      ),
    },
    {
      field: 'changeClass',
      headerName: '권한변경',
      renderCell: ({ row }) => {
        return (
          <Select
            size="sm"
            onChange={(e) => {
              if (e.target.value) {
                const value = e.target.value as AdminType;
                handleSelectBox(value);
              }
            }}
            disabled={profile?.id === row.id}
            placeholder="계정의 권한 변경"
          >
            <option value="super">슈퍼계정</option>
            <option value="full">개인정보접근허용</option>
            <option value="normal">개인정보접근불가</option>
          </Select>
        );
      },
    },
    {
      field: 'delete',
      headerName: '계정삭제',
      renderCell: ({ row }) => {
        return (
          <Button
            size="xs"
            onClick={() => handleDeleteButton(row.id)}
            colorScheme="red"
            disabled={profile?.id === row.id}
          >
            계정삭제
          </Button>
        );
      },
    },
  ];

  if (!profileIsLoading && profile?.adminClass !== 'super') {
    toast({
      title: '권한없는 계정',
      status: 'error',
    });
    router.push('/admin');
  }

  if (isLoading) return <Box>로딩중...</Box>;

  return (
    <ChakraDataGrid
      borderWidth={0}
      hideFooter
      headerHeight={50}
      minH={300}
      density="compact"
      columns={columns.map((x) => ({ ...x, flex: isDesktopSize ? 1 : undefined }))}
      rows={data || []}
      rowCount={5}
      rowsPerPageOptions={[25, 50]}
      disableColumnMenu
      disableColumnFilter
      disableSelectionOnClick
    />
  );
}
