import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { Box, Button, useDisclosure } from '@chakra-ui/react';
import {
  GridColumns,
  GridRowData,
  GridFilterModel,
  GridToolbar,
} from '@material-ui/data-grid';
import { useAdminMileageLogList } from '@project-lc/hooks';
import { adminMileageManageStore } from '@project-lc/stores';
import { useState } from 'react';
import dayjs from 'dayjs';
import { AdminMileageLogDetailDialog } from './AdminMileageLogDetailDialog';
import { MileageActionTypeBadge } from './MileageActionTypeBadge';

export function AdminMileageLogList(): JSX.Element {
  const { data } = useAdminMileageLogList();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { setMileageLogDetail } = adminMileageManageStore();

  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });

  const columns: GridColumns = [
    { field: 'id', headerName: ' ', width: 10 },
    {
      field: 'email',
      headerName: 'email',
      valueGetter: ({ row }: GridRowData) => row.customer.email,
      flex: 1,
    },
    { field: 'amount', headerName: '변동액' },
    {
      field: 'actionType',
      headerName: '유형',
      renderCell: ({ row }: GridRowData) => (
        <MileageActionTypeBadge actionType={row.actionType} lineHeight={2} />
      ),
    },
    {
      field: 'createDate',
      headerName: '날짜',
      valueFormatter: ({ row }: GridRowData) =>
        dayjs(row.createDate).format('YYYY-MM-DD HH:mm:ss'),
      flex: 1,
    },
    {
      field: '상세',
      headerName: '상세보기',
      renderCell: ({ row }) => (
        <Button size="xs" onClick={() => handleButtonClick(row)}>
          상세보기
        </Button>
      ),
    },
  ];

  const handleButtonClick = (row: GridRowData): void => {
    setMileageLogDetail(row);
    onOpen();
  };

  return (
    <Box>
      <ChakraDataGrid
        components={{
          Toolbar: GridToolbar,
        }}
        columns={columns}
        rows={data || []}
        minH={500}
        rowCount={25}
        density="compact"
        rowsPerPageOptions={[25, 50]}
        filterModel={filterModel}
        onFilterModelChange={(model) => setFilterModel(model)}
        disableSelectionOnClick
      />
      <AdminMileageLogDetailDialog isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}

export default AdminMileageLogList;
