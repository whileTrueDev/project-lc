import { Box, Text, Badge } from '@chakra-ui/react';
import { useSellerSettlementHistory, useDisplaySize } from '@project-lc/hooks';
import dayjs from 'dayjs';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { GridColumns } from '@material-ui/data-grid';

function switchType(value: string): string {
  let paperType = '';
  switch (value) {
    case 'mailOrder':
      paperType = '통신판매증';
      break;
    case 'settlementAccount':
      paperType = '정산계좌';
      break;
    case 'businessRegistration':
      paperType = '사업자등록증';
      break;
    default:
      paperType = '';
  }
  return paperType;
}

function switchStatus(value: string): JSX.Element {
  let result = null;
  switch (value) {
    case 'waiting':
      // status = '등록됨';
      result = { color: 'yellow', text: '승인신청' };
      break;
    case 'confirmed':
      result = { color: 'green', text: '승인완료' };
      break;
    case 'rejected':
      result = { color: 'red', text: '반려' };
      break;
    default:
      result = { color: 'white', text: '' };
  }
  return (
    <Box lineHeight={2}>
      <Badge colorScheme={result.color} fontSize="sm" size="sm">
        {result.text}
      </Badge>
    </Box>
  );
}

const columns: GridColumns = [
  {
    field: 'type',
    headerName: '유형',
    valueFormatter: ({ row }) => switchType(row.type),
  },
  {
    field: 'status',
    headerName: '상태',
    renderCell: ({ row }) => switchStatus(row.status),
  },
  {
    field: 'createDate',
    headerName: '날짜',
    valueFormatter: ({ row }) => dayjs(row.createDate).format('YYYY-MM-DD HH:mm'),
  },
];

export function SettlementConfirmationHistoryBox(): JSX.Element {
  const { data } = useSellerSettlementHistory();
  const { isDesktopSize } = useDisplaySize();

  return (
    <Box borderWidth="1px" borderRadius="lg" p={7}>
      <Text fontSize="lg" fontWeight="medium" pb={1}>
        정산정보 승인 내역
      </Text>
      <Text fontSize="sm" m={1}>
        * 최근 7개까지 조회됩니다
      </Text>
      <ChakraDataGrid
        borderWidth={0}
        hideFooter
        headerHeight={50}
        minH={300}
        density="compact"
        columns={columns.map((x) => ({ ...x, flex: isDesktopSize ? 1 : undefined }))}
        rows={data || []}
        disableColumnMenu
        disableColumnFilter
        disableSelectionOnClick
      />
    </Box>
  );
}

export default SettlementConfirmationHistoryBox;
