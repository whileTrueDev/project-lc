import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { Box, Button, useDisclosure } from '@chakra-ui/react';
import {
  GridColumns,
  GridRowData,
  GridFilterModel,
  GridToolbar,
} from '@material-ui/data-grid';
import { useAdminMileageList } from '@project-lc/hooks';
import { useState } from 'react';
import { AdminMileageManageDialog } from './AdminMileageManageDialog';

export function AdminMileageList(): JSX.Element {
  const { data } = useAdminMileageList();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [mileageDetail, setMileageDetail] = useState<GridRowData>();

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
    {
      field: 'mileage',
      headerName: '보유액',
      valueFormatter: ({ row }: GridRowData) => row.mileage.toLocaleString(),
    },
    {
      field: 'button',
      headerName: '관리',
      renderCell: ({ row }: GridRowData) => (
        <Button size="xs" onClick={() => handleButtonClick(row)}>
          관리
        </Button>
      ),
    },
  ];

  const handleButtonClick = (row: GridRowData): void => {
    setMileageDetail(row);
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
        disableColumnMenu
        disableSelectionOnClick
      />
      <AdminMileageManageDialog
        isOpen={isOpen}
        onClose={onClose}
        mileageDetail={mileageDetail}
      />
    </Box>
  );
}

export default AdminMileageList;
