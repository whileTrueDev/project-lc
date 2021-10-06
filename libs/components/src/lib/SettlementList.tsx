import { GridColumns } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import { Badge, useColorModeValue } from '@chakra-ui/react';
import { useDisplaySize } from '@project-lc/hooks';
import dayjs from 'dayjs';
import { SellerSettlements } from '@prisma/client';
import { ChakraDataGrid } from './ChakraDataGrid';

export type SettlementListProps = { sellerSettlements: SellerSettlements[] };

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
    headerName: '날짜',
    valueFormatter: ({ row }) => dayjs(row.date as Date).format('YYYY/MM/DD HH:mm:ss'),
  },
  {
    field: 'payment',
    headerName: '금액',
    valueFormatter: ({ row }) =>
      new Intl.NumberFormat('kr', { style: 'currency', currency: 'KRW' }).format(
        row.amount,
      ),
  },
  {
    field: 'state',
    headerName: '상태',
    renderCell: (params) => switchBadge(params.row.state),
  },
];

function makeListRow(
  sellerSettlements: SellerSettlements[] | undefined,
): SellerSettlements[] {
  if (!sellerSettlements) {
    return [];
  }
  return sellerSettlements.map((element, index: number) => {
    return { ...element, id: index, isRowSelectable: false };
  });
}

// 정산 내역을 보여주는 데이터 그리드
export function SettlementList(props: SettlementListProps): JSX.Element {
  const { isDesktopSize } = useDisplaySize();
  const { sellerSettlements } = props;
  const useStyle = makeStyles({
    columnHeader: {
      backgroundColor: useColorModeValue('inherit', '#2D3748'),
    },
    root: {
      borderWidth: 0,
      color: useColorModeValue('inherit', `rgba(255, 255, 255, 0.92)`),
      height: '95%',
    },
  });

  const classes = useStyle();

  return (
    <ChakraDataGrid
      classes={{
        columnHeader: classes.columnHeader,
        root: classes.root,
      }}
      borderWidth={0}
      minHeight={120}
      hideFooter
      headerHeight={50}
      density="compact"
      columns={columns.map((x) => ({ ...x, flex: isDesktopSize ? 1 : undefined }))}
      rows={makeListRow(sellerSettlements)}
      rowCount={5}
      rowsPerPageOptions={[25, 50]}
      disableColumnMenu
      disableColumnFilter
      disableSelectionOnClick
    />
  );
}
