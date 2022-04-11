import { Box, Container } from '@chakra-ui/react';
import { GridColumns, GridRowData, GridSortModel } from '@material-ui/data-grid';
import { SellType } from '@prisma/client';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { SellTypeBadge } from '@project-lc/components-shared/SellTypeBadge';
import {
  useDisplaySize,
  useFmOrdersDuringLiveShoppingSalesPurchaseDone,
  useProfile,
} from '@project-lc/hooks';
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
      return <SellTypeBadge sellType={row.sellType as SellType} lineHeight={2} />;
    },
  },
  {
    field: 'goods_name',
    headerName: '상품명',
    width: 400,
  },
  {
    field: 'userNickname',
    headerName: '닉네임',
    width: 140,
  },
  {
    field: 'userMessage',
    headerName: '메세지',
    minWidth: 400,
    flex: 1,
  },
  {
    field: 'settleprice',
    headerName: '금액',
    width: 120,
    valueFormatter: ({ row }) => {
      return `${getLocaleNumber(row.settleprice)}원`;
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
    headerName: ' ',
    width: 80,
    valueFormatter: ({ row }) => {
      return `${getLocaleNumber(row.settleprice)}원`;
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
    <Box>
      {purchaseData && !isLoading && (
        <Container maxW="1600px" p={{ base: 0, md: 8 }}>
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
            rows={purchaseData}
            sortModel={sortModel}
          />
        </Container>
      )}
    </Box>
  );
}

export default BroadcasterPurchaseList;
