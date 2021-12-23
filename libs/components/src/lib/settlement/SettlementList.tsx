import { DownloadIcon, InfoIcon } from '@chakra-ui/icons';
import { Box, Button, Stack, Text, useDisclosure } from '@chakra-ui/react';
import {
  GridColumns,
  GridToolbarContainer,
  GridToolbarExport,
} from '@material-ui/data-grid';
import {
  SettlementDoneItem,
  useDisplaySize,
  useSettlementHistory,
} from '@project-lc/hooks';
import { settlementHistoryStore } from '@project-lc/stores';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { useState } from 'react';
import { ChakraDataGrid } from '@project-lc/components-core';
import { YouCanHorizontalScrollText } from '../YouCanHorizontalScrollText';
import { SettlementInfoDialog } from './SettlementInfoDialog';

/** 판매자 정산 내역 */
export function SettlementList(): JSX.Element | null {
  const { isDesktopSize } = useDisplaySize();

  const { onOpen, isOpen, onClose } = useDisclosure();
  const selectedRound = settlementHistoryStore((s) => s.selectedRound);
  const { data } = useSettlementHistory(
    { round: selectedRound },
    { enabled: !!selectedRound },
  );

  const [selectedSettlementItem, setSelectedSettlementItem] =
    useState<SettlementDoneItem | null>(null);

  const columns: GridColumns = [
    {
      field: 'id',
      headerName: '고유번호',
      renderCell: (params) => (
        <NextLink href="#" passHref>
          <Button
            variant="link"
            color="blue.500"
            textDecoration="underline"
            isTruncated
            onClick={() => {
              setSelectedSettlementItem(params.row as SettlementDoneItem);
              onOpen();
            }}
          >
            {params.row.id}
          </Button>
        </NextLink>
      ),
    },
    { field: 'round', headerName: '회차', minWidth: 100 },
    {
      field: 'startDate',
      headerName: '출고일',
      valueFormatter: (params) => dayjs(params.row.startDate).format('YYYY/MM/DD'),
    },
    {
      field: 'doneDate',
      headerName: '구매완료일',
      valueFormatter: (params) => dayjs(params.row.doneDate).format('YYYY/MM/DD'),
    },
    {
      field: 'date',
      headerName: '정산일',
      valueFormatter: (params) => dayjs(params.row.date).format('YYYY/MM/DD'),
    },
    { field: 'exportId', headerName: '출고번호', sortable: false },
    { field: 'exportCode', headerName: '출고코드', sortable: false },
    { field: 'buyer', headerName: '구매자', sortable: false },
    { field: 'recipient', headerName: '수령자', sortable: false },
    { field: 'shippingCost', headerName: '배송비', sortable: false },
    {
      field: 'totalEa',
      headerName: '총판매수량',
      sortable: false,
      valueFormatter: ({ value }) => (value ? value.toLocaleString() : value),
    },
    {
      field: 'totalPrice',
      headerName: '총판매금',
      sortable: false,
      valueFormatter: ({ value }) => (value ? value.toLocaleString() : value),
    },
    {
      field: 'totalCommission',
      headerName: '총수수료',
      sortable: false,
      valueFormatter: ({ value }) => (value ? value.toLocaleString() : value),
    },
    {
      field: 'totalAmount',
      headerName: '총정산금액',
      sortable: false,
      valueFormatter: ({ value }) => (value ? value.toLocaleString() : value),
    },
    { field: 'paymentMethod', headerName: '결제수단', sortable: false },
    { field: 'pg', headerName: 'pg사', sortable: false },
    {
      field: 'pgCommission',
      headerName: '전자결제수수료',
      sortable: false,
      valueFormatter: ({ value }) => (value ? value.toLocaleString() : value),
    },
    {
      field: 'seller.sellerShop.shopName',
      headerName: '판매자',
      valueFormatter: (param) =>
        param.row.seller?.sellerShop?.shopName || param.row.sellerEmail,
      sortable: false,
    },
  ];

  if (!data) return null;

  return (
    <Box px={{ base: 2, sm: 7 }} height="400px" mb={12}>
      {data.length > 0 && (
        <Text mb={2}>
          <InfoIcon color="blue.500" mr={2} />
          <YouCanHorizontalScrollText />
        </Text>
      )}
      <ChakraDataGrid
        minHeight={120}
        headerHeight={50}
        hideFooter
        density="compact"
        columns={columns.map((x) => ({
          ...x,
          flex: isDesktopSize ? 1 : undefined,
          minWidth: 100,
        }))}
        rows={data || []}
        rowCount={5}
        rowsPerPageOptions={[25, 50]}
        disableColumnMenu
        disableColumnFilter
        disableSelectionOnClick
        components={{
          Toolbar: () => (
            <GridToolbarContainer>
              <Stack direction="row" m={0} p={0} mb={2}>
                <Button size="sm" as="div">
                  <GridToolbarExport
                    csvOptions={{
                      allColumns: true,
                      fileName: `크크쇼_정산내역_${selectedRound}`,
                    }}
                  />
                </Button>
              </Stack>
            </GridToolbarContainer>
          ),
          ExportIcon: DownloadIcon,
        }}
      />

      {selectedSettlementItem && (
        <SettlementInfoDialog
          isOpen={isOpen}
          onClose={onClose}
          settlementInfo={selectedSettlementItem}
        />
      )}
    </Box>
  );
}
