import { Box } from '@chakra-ui/react';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import dayjs from 'dayjs';
import { useCustomerMileageHistory } from '@project-lc/hooks';
import { MileageActionTypeBadge } from '@project-lc/components-shared/MileageActionTypeBadge';

const column: GridColumns = [
  {
    field: 'amount',
    headerName: '금액',
    flex: 1,
  },

  {
    field: 'actionType',
    headerName: '유형',
    renderCell: ({ row }: GridRowData) => (
      <MileageActionTypeBadge actionType={row.actionType} lineHeight={2} />
    ),
    flex: 1,
  },
  {
    field: 'createDate',
    headerName: '날짜',
    valueFormatter: ({ row }: GridRowData) =>
      dayjs(row.createDate).format('YYYY-MM-DD HH:mm:ss'),
    flex: 1,
  },
];

export function CustomerMileagenHistoryList(): JSX.Element {
  const { data } = useCustomerMileageHistory();
  return (
    <Box>
      <ChakraDataGrid
        rows={data || []}
        columns={column}
        minH={500}
        density="compact"
        disableColumnSelector
        disableSelectionOnClick
      />
    </Box>
  );
}
