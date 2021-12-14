import { DownloadIcon, Icon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Link,
  Stack,
  Text,
  Tooltip,
  useBreakpoint,
  useDisclosure,
} from '@chakra-ui/react';
import { GridColumns, GridRowId, GridToolbarContainer } from '@material-ui/data-grid';
import {
  useDisplaySize,
  useFmOrders,
  useBroadcasterLiveShoppingConnectionId,
  useProfile,
  useFmOrdersDuringLiveShoppingSalesPurchaseDone,
} from '@project-lc/hooks';
import {
  convertFmOrderStatusToString,
  convertOrderSitetypeToString,
  FmOrderStatusNumString,
  isOrderExportable,
} from '@project-lc/shared-types';
import { useFmOrderStore } from '@project-lc/stores';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { useMemo } from 'react';
import { FaTruck } from 'react-icons/fa';
import { ChakraDataGrid } from './ChakraDataGrid';
import ExportManyDialog from './ExportManyDialog';
import FmOrderStatusBadge from './FmOrderStatusBadge';
import TooltipedText from './TooltipedText';

const columns: GridColumns = [
  {
    field: 'deposit_date',
    headerName: '주문일',
    width: 140,
    valueFormatter: ({ row }) => {
      return dayjs(row.deposit_date).format('YYYY/MM/DD HH:mm');
    },
  },
  {
    field: 'title',
    headerName: '닉네임',
    width: 170,
  },
  {
    field: 'nickname',
    headerName: '닉네임',
    width: 220,
    valueFormatter: ({ row }) => {
      return row.message.split('||')[0].split('&&')[1];
    },
  },
  {
    field: 'message',
    headerName: '메세지',
    width: 220,
    valueFormatter: ({ row }) => {
      return row.message.split('||')[1].split('&&')[1];
    },
  },
  {
    field: 'settleprice',
    headerName: '금액',
    width: 170,
    valueFormatter: ({ row }) => {
      return row.settleprice.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
];

export function BroadcasterPurchaseList(): JSX.Element {
  const { data: profileData } = useProfile();

  const { data: purchaseData, isLoading } =
    useFmOrdersDuringLiveShoppingSalesPurchaseDone(profileData?.id);
  console.log(purchaseData);

  return (
    <Box minHeight={{ base: 300, md: 600 }} mb={24}>
      {purchaseData && !isLoading && (
        <ChakraDataGrid
          autoHeight
          rowsPerPageOptions={[10, 20, 50, 100]}
          disableSelectionOnClick
          disableColumnMenu
          loading={isLoading}
          columns={columns}
          rows={purchaseData}
        />
      )}
    </Box>
  );
}

export default BroadcasterPurchaseList;
