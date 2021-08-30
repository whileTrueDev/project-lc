import {
  GridColumns,
  // GridRowId,
  // GridSelectionModel,
  // GridToolbarContainer,
  // GridToolbarExport,
} from '@material-ui/data-grid';
import { Badge } from '@chakra-ui/react';
import { useDisplaySize } from '@project-lc/hooks';
import dayjs from 'dayjs';
import { ChakraDataGrid } from './ChakraDataGrid';

function switchBadge(state: number): JSX.Element {
  let option = null;
  switch (state) {
    case 1: {
      option = {
        color: 'green',
        text: '정산 완료',
      };
      break;
    }
    case 2: {
      option = {
        color: 'red',
        text: '정산 반려',
      };
      break;
    }
    default: {
      option = {
        color: 'yellow',
        text: '정산 대기',
      };
    }
  }

  return (
    <Badge
      colorScheme={option?.color}
      height={25}
      fontSize="0.8em"
      style={{ display: 'flex', alignItems: 'center' }}
    >
      {option?.text}
    </Badge>
  );
}
const columns: GridColumns = [
  {
    field: 'date',
    headerName: '정산 날짜',
    valueFormatter: ({ row }) => dayjs(row.date as any).format('YYYY/MM/DD HH:mm:ss'),
  },
  {
    field: 'payment',
    headerName: '정산 금액',
    valueFormatter: ({ row }) =>
      new Intl.NumberFormat('kr', { style: 'currency', currency: 'KRW' }).format(
        row.payment,
      ),
  },
  {
    field: 'state',
    headerName: '정산 상태',
    renderCell: (params) => switchBadge(params.row.state),
  },
];

// 정산 내역을 보여주는 데이터 그리드
export function SettlementList(): JSX.Element {
  const { isDesktopSize } = useDisplaySize();

  return (
    <ChakraDataGrid
      borderWidth={0}
      hideFooterSelectedRowCount
      headerHeight={50}
      minHeight={150}
      density="compact"
      columns={columns.map((x) => ({ ...x, flex: isDesktopSize ? 1 : undefined }))}
      rows={[
        {
          id: '1',
          date: '2021-09-01 13:00:00',
          payment: 29999,
          state: 1,
          isRowSelectable: false,
        },
        {
          id: '2',
          date: '2021-09-01 00:00:00',
          payment: 49999,
          state: 2,
          isRowSelectable: false,
        },
      ]}
      style={{ borderWidth: 0 }}
      rowCount={5}
      rowsPerPageOptions={[5, 10]}
      disableColumnMenu
      disableColumnFilter
      disableSelectionOnClick
    />
  );
}
