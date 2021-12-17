import { Box, Text } from '@chakra-ui/layout';
import { GridCellParams, GridColumns } from '@material-ui/data-grid';
import {
  useBroadcasterSettlementHistory,
  useDisplaySize,
  useProfile,
} from '@project-lc/hooks';
import { FindBCSettlementHistoriesRes } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { ChakraDataGrid } from '../ChakraDataGrid';

export function BcSettlementHistoryBox(): JSX.Element {
  return (
    <Box borderWidth="thin" borderRadius="lg" p={7} height="100%">
      <Text fontSize="lg" fontWeight="medium">
        정산 완료 목록
      </Text>
      <BcSettlementHistory />
    </Box>
  );
}

export function BcSettlementHistory(): JSX.Element {
  const profile = useProfile();
  const { data } = useBroadcasterSettlementHistory(profile.data?.id);
  const { isDesktopSize } = useDisplaySize();
  const columns = useMemo<GridColumns>(
    () => [
      {
        headerName: '회차',
        field: 'round',
        width: 130,
        flex: isDesktopSize ? 1 : undefined,
      },
      {
        headerName: '정산일',
        field: 'date',
        width: 170,
        flex: isDesktopSize ? 1 : undefined,
        valueFormatter: ({ value }) =>
          dayjs(value as string).format('YYYY년MM월DD일 HH시'),
      },
      {
        width: 140,
        sortable: false,
        headerName: '총 정산 금액',
        field: 'totalAmount',
        renderCell: TotalAmountCell,
        flex: isDesktopSize ? 1 : undefined,
      },
    ],
    [isDesktopSize],
  );
  return (
    <Box minH={300}>
      <ChakraDataGrid
        mt={4}
        disableSelectionOnClick
        disableColumnMenu
        density="compact"
        autoHeight
        pageSize={5}
        columns={columns}
        rows={data || []}
      />
    </Box>
  );
}

function TotalAmountCell({ row }: GridCellParams): JSX.Element {
  const totalAmount = useMemo(() => {
    return (
      row as FindBCSettlementHistoriesRes[number]
    ).broadcasterSettlementItems.reduce(
      (prev, item) => (prev ? prev + item.amount : item.amount),
      0,
    );
  }, [row]);
  return <Text>{`${totalAmount.toLocaleString()}원`}</Text>;
}
