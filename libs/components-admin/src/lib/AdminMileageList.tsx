import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { Box } from '@chakra-ui/react';
import { GridColumns, GridCellParams } from '@material-ui/data-grid';

const columns: GridColumns = [
  { field: 'email', headerName: 'email' },
  { field: 'mileage', headerName: '보유액' },
];

export function AdminMileageList(): JSX.Element {
  return (
    <Box>
      <ChakraDataGrid
        columns={columns}
        rows={[]}
        density="compact"
        disableColumnMenu
        disableColumnFilter
        disableSelectionOnClick
        rowCount={25}
        rowsPerPageOptions={[25, 50]}
      />
    </Box>
  );
}

export default AdminMileageList;
