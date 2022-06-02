import { Box, Center, Spinner, Text } from '@chakra-ui/react';
import { GridColumns, GridRowData, GridSortModel } from '@material-ui/data-grid';
import { SellType } from '@prisma/client';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { SellTypeBadge } from '@project-lc/components-shared/SellTypeBadge';
import { useBroadcasterPurchases, useDisplaySize, useProfile } from '@project-lc/hooks';
import { BroadcasterPurchasesItem } from '@project-lc/shared-types';
import { getLocaleNumber } from '@project-lc/utils-frontend';
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
    field: 'sellType',
    headerName: '판매유형',
    width: 120,
    renderCell: ({ row }: GridRowData) => {
      return <SellTypeBadge sellType={row.channel as SellType} lineHeight={2} />;
    },
    sortable: false,
  },
  {
    field: 'goods_name',
    headerName: '상품명',
    width: 400,
    renderCell: ({ row }) => {
      const data = row as BroadcasterPurchasesItem;
      return (
        <Text isTruncated>
          {data.goods.goods_name}(
          <Text as="span" fontSize="xs">
            {data.options.map((o) => `${o.value}${o.quantity}개`).join(',')}
          </Text>
          )
        </Text>
      );
    },
    sortable: false,
  },
  {
    field: 'userNickname',
    headerName: '닉네임',
    width: 140,
    valueFormatter: ({ row }) => (row as BroadcasterPurchasesItem).support.nickname,
    sortable: false,
  },
  {
    field: 'userMessage',
    headerName: '메세지',
    minWidth: 400,
    flex: 1,
    valueFormatter: ({ row }) => (row as BroadcasterPurchasesItem).support.message,
    sortable: false,
  },
  {
    field: 'settleprice',
    headerName: '금액',
    width: 120,
    valueFormatter: ({ row }) => {
      return `${getLocaleNumber((row as BroadcasterPurchasesItem).order.paymentPrice)}원`;
    },
    sortable: false,
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
    valueFormatter: ({ row }) => (row as BroadcasterPurchasesItem).support.nickname,
  },
  {
    field: 'settleprice',
    headerName: '금액',
    width: 120,
    valueFormatter: ({ row }) => {
      return `${getLocaleNumber((row as BroadcasterPurchasesItem).order.paymentPrice)}원`;
    },
  },
];

export function BroadcasterPurchaseList(): JSX.Element {
  const { isMobileSize } = useDisplaySize();
  const [pageSize, setPageSize] = useState(15);
  const sortModel: GridSortModel = [{ field: 'regist_date', sort: 'desc' }];
  const { data: profileData } = useProfile();
  const { data: purchaseData, isLoading } = useBroadcasterPurchases(profileData?.id);

  if (isLoading)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  if (!purchaseData || purchaseData.length === 0)
    return (
      <Box my={10}>
        <Text>아직 현황에 표시할 데이터가 없습니다.</Text>
      </Box>
    );

  return (
    <Box>
      <ChakraDataGrid
        autoHeight
        disableExtendRowFullWidth
        pagination
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[15, 20, 30]}
        disableSelectionOnClick
        disableColumnMenu
        loading={isLoading}
        columns={isMobileSize ? mobileColumn : columns}
        rows={purchaseData || []}
        sortModel={sortModel}
      />
    </Box>
  );
}

export default BroadcasterPurchaseList;
