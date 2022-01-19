import { Box, Grid, GridItem } from '@chakra-ui/react';
import { GridColumns, GridSortModel } from '@material-ui/data-grid';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import {
  useFmOrdersDuringLiveShoppingSalesPurchaseDone,
  useProfile,
  useDisplaySize,
} from '@project-lc/hooks';
import dayjs from 'dayjs';
import { useState } from 'react';

const columns: GridColumns = [
  {
    field: 'regist_date',
    headerName: '주문일',
    width: 140,
    valueFormatter: ({ row }) => {
      return dayjs(row.regist_date).format('YYYY/MM/DD HH:mm');
    },
  },
  {
    field: 'goods_name',
    headerName: '상품명',
    width: 400,
    flex: 1,
  },
  {
    field: 'userNickname',
    headerName: '닉네임',
    width: 140,
  },
  {
    field: 'userMessage',
    headerName: '메세지',
    width: 220,
    flex: 1,
  },
  {
    field: 'settleprice',
    headerName: '금액',
    width: 170,
    valueFormatter: ({ row }) => {
      return `${Number(row.settleprice).toLocaleString()}원`;
    },
  },
];

const mobileColumn: GridColumns = [
  {
    field: 'regist_date',
    headerName: '주문일',
    width: 140,
    valueFormatter: ({ row }) => {
      return dayjs(row.regist_date).format('YYYY/MM/DD HH:mm');
    },
  },
  {
    field: 'userNickname',
    headerName: '닉네임',
    width: 140,
  },
  {
    field: 'settleprice',
    headerName: '금액',
    width: 170,
    valueFormatter: ({ row }) => {
      return `${Number(row.settleprice).toLocaleString()}원`;
    },
  },
];

export function BroadcasterPurchaseList(): JSX.Element {
  const { data: profileData } = useProfile();
  const { isMobileSize } = useDisplaySize();
  const [pageSize, setPageSize] = useState(15);
  const sortModel: GridSortModel = [
    {
      field: 'regist_date',
      sort: 'desc',
    },
  ];

  const { data: purchaseData, isLoading } =
    useFmOrdersDuringLiveShoppingSalesPurchaseDone(profileData?.id);

  return (
    <Box minHeight={{ base: 300, md: 600 }} pt={3}>
      {purchaseData && !isLoading && !isMobileSize && (
        <Grid templateColumns="repeat(7, 1fr)">
          <GridItem colSpan={1} />
          <GridItem w="100%" colSpan={5}>
            <ChakraDataGrid
              autoHeight
              disableExtendRowFullWidth
              pagination
              showFirstButton
              showLastButton
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[15, 20, 30]}
              disableSelectionOnClick
              disableColumnMenu
              loading={isLoading}
              columns={columns}
              rows={purchaseData}
              sortModel={sortModel}
            />
          </GridItem>
          <GridItem colSpan={1} />
        </Grid>
      )}
      {purchaseData && !isLoading && isMobileSize && (
        <ChakraDataGrid
          autoHeight
          disableExtendRowFullWidth
          pagination
          showFirstButton
          showLastButton
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[15, 20, 30]}
          disableSelectionOnClick
          disableColumnMenu
          loading={isLoading}
          columns={mobileColumn}
          rows={purchaseData}
          sortModel={sortModel}
        />
      )}
    </Box>
  );
}

export default BroadcasterPurchaseList;
