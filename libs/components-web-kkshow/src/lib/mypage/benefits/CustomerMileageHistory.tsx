import { Box } from '@chakra-ui/react';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import dayjs from 'dayjs';
import { useCustomerMileageHistory } from '@project-lc/hooks';
import { MileageActionTypeBadge } from '@project-lc/components-shared/MileageActionTypeBadge';
import { getLocaleNumber } from '@project-lc/utils-frontend';

const column: GridColumns = [
  {
    width: 110,
    field: 'amount',
    headerName: '금액',
    valueFormatter: ({ row }) => `${getLocaleNumber(row.amount)}원`,
  },

  {
    field: 'actionType',
    headerName: '유형',
    sortable: false,
    renderCell: ({ row }: GridRowData) => (
      <MileageActionTypeBadge actionType={row.actionType} lineHeight={2} />
    ),
  },
  {
    width: 160,
    field: 'createDate',
    headerName: '날짜',
    valueFormatter: ({ row }: GridRowData) =>
      dayjs(row.createDate).format('YYYY-MM-DD HH:mm:ss'),
  },
];

export function CustomerMileagenHistoryList(): JSX.Element {
  const { data, isLoading } = useCustomerMileageHistory();
  return (
    <Box>
      <ChakraDataGrid
        rows={data || []}
        loading={isLoading}
        columns={column}
        minH={500}
        density="compact"
        disableColumnSelector
        disableSelectionOnClick
      />
    </Box>
  );
}
