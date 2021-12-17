import { Box, Text } from '@chakra-ui/layout';
import { GridCellParams } from '@material-ui/data-grid';
import { useBroadcasterSettlementHistory, useProfile } from '@project-lc/hooks';
import { FindBCSettlementHistoriesRes } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { ChakraDataGrid } from '../ChakraDataGrid';

export function BcSettlementHistory(): JSX.Element {
  const profile = useProfile();
  const { data } = useBroadcasterSettlementHistory(profile.data?.id);
  return (
    <Box minH={400}>
      <ChakraDataGrid
        disableSelectionOnClick
        disableColumnMenu
        density="compact"
        autoHeight
        columns={[
          { headerName: '회차', field: 'round', width: 130 },
          {
            headerName: '정산일',
            field: 'date',
            width: 170,
            valueFormatter: ({ value }) =>
              dayjs(value as string).format('YYYY년MM월DD일 HH시'),
          },
          {
            width: 140,
            sortable: false,
            headerName: '총 정산 금액',
            field: 'totalAmount',
            renderCell: TotalAmountCell,
          },
        ]}
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
