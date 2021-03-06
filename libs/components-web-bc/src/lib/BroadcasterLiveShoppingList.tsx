import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Button, Link, Text, Tooltip, useDisclosure } from '@chakra-ui/react';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { LiveShoppingDetailDialog } from '@project-lc/components-shared/LiveShoppingDetailDialog';
import { LiveShoppingProgressBadge } from '@project-lc/components-shared/LiveShoppingProgressBadge';
import { useDisplaySize, useLiveShoppingList, useProfile } from '@project-lc/hooks';
import { getLiveShoppingProgress, LiveShoppingWithGoods } from '@project-lc/shared-types';
import { liveShoppingStateBoardWindowStore } from '@project-lc/stores';
import { getCustomerWebHost } from '@project-lc/utils';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import { memo, useCallback, useMemo, useState } from 'react';

export function BroadcasterLiveShoppingList({
  useSmallSize = false,
}: {
  useSmallSize?: boolean;
}): JSX.Element {
  const { data: profileData } = useProfile();
  const [selectedLiveShopping, setSelectedLiveShopping] =
    useState<LiveShoppingWithGoods>();
  const [pageSize, setPageSize] = useState<number>(5);
  const { isMobileSize } = useDisplaySize();

  const { data: tableData } = useLiveShoppingList({ broadcasterId: profileData?.id });

  const {
    isOpen: detailIsOpen,
    onOpen: detailOnOpen,
    onClose: detailOnClose,
  } = useDisclosure();

  const handleDetailOpenClick = useCallback(
    (target: LiveShoppingWithGoods): void => {
      setSelectedLiveShopping(target);
      detailOnOpen();
    },
    [detailOnOpen],
  );

  const StateBoardWindowOpenButton = memo(
    ({
      shoppingProgress,
      broadcastId,
    }: {
      shoppingProgress: string;
      broadcastId: number;
    }): JSX.Element => {
      const { openWindow } = liveShoppingStateBoardWindowStore();

      const openLiveShoppingStateWindow = useCallback(() => {
        if (isMobileSize) return;
        const url = `${window.location.origin}/mypage/live/state/${broadcastId}`;
        const windowFeatures = 'scrollbars,resizable,width=800, height=600';
        openWindow(url, '_black', windowFeatures);
      }, [broadcastId, openWindow]);

      return (
        <Button
          size="xs"
          colorScheme="green"
          disabled={
            ['?????????', '?????????', '?????????'].includes(shoppingProgress) ||
            Boolean(isMobileSize)
          }
          onClick={openLiveShoppingStateWindow}
        >
          {shoppingProgress === '???????????????' && '????????? '}
          {['????????????', '????????????'].includes(shoppingProgress) && '?????? '}
          ??????
        </Button>
      );
    },
  );

  const columns: GridColumns = useMemo(
    () => [
      {
        headerName: '',
        field: '????????????',
        width: 90,
        sortable: false,
        disableColumnMenu: true,
        renderCell: ({ row }: GridRowData) => (
          <Button size="xs" colorScheme="blue" onClick={() => handleDetailOpenClick(row)}>
            ????????????
          </Button>
        ),
      },
      {
        headerName: '',
        field: '??????',
        width: 100,
        sortable: false,
        disableColumnMenu: true,
        renderCell: ({ row }: GridRowData) => {
          const shoppingProgress = getLiveShoppingProgress(row);
          return (
            <StateBoardWindowOpenButton
              shoppingProgress={shoppingProgress}
              broadcastId={row.id}
            />
          );
        },
      },
      {
        field: 'liveShoppingName',
        headerName: '????????? ?????????',
        minWidth: 350,
        flex: 1,
        valueFormatter: ({ row }) =>
          row.liveShoppingName || '????????? ???????????? ????????? ?????? ?????? ???, ???????????????.',
      },
      {
        field: 'goods_name',
        headerName: '?????????',
        minWidth: 350,
        renderCell: ({ row }) =>
          new Date(row.sellEndDate) > new Date() ? (
            <Tooltip label="?????????????????? ??????">
              <Link href={`${getCustomerWebHost()}/goods/${row.goodsId}`} isExternal>
                {row.goods.goods_name} <ExternalLinkIcon mx="2px" />
              </Link>
            </Tooltip>
          ) : (
            <Text>{row.goods.goods_name}</Text>
          ),
      },
      {
        field: 'progress',
        headerName: '??????',
        renderCell: ({ row }: GridRowData) => (
          <Box lineHeight={2}>
            <LiveShoppingProgressBadge
              progress={row.progress}
              broadcastStartDate={row.broadcastStartDate}
              broadcastEndDate={row.broadcastEndDate}
              sellEndDate={row.sellEndDate}
            />
          </Box>
        ),
      },
      {
        field: 'seller.sellerShop.shopName',
        headerName: '?????????',
        minWidth: 200,
        valueFormatter: (params) => params.row?.seller.sellerShop.shopName,
      },
      {
        headerName: '????????????',
        field: '????????????',
        minWidth: 300,
        renderCell: ({ row }: GridRowData) =>
          `${
            row.broadcastStartDate
              ? dayjs(row.broadcastStartDate).format('YYYY/MM/DD HH:mm')
              : '??????'
          } - ${
            row.broadcastEndDate
              ? dayjs(row.broadcastEndDate).format('YYYY/MM/DD HH:mm')
              : '??????'
          }`,
      },
      {
        headerName: '????????????',
        field: '????????????',
        minWidth: 300,
        renderCell: ({ row }: GridRowData) =>
          `${
            row.sellStartDate
              ? dayjs(row.sellStartDate).format('YYYY/MM/DD HH:mm')
              : '??????'
          } - ${
            row.sellEndDate ? dayjs(row.sellEndDate).format('YYYY/MM/DD HH:mm') : '??????'
          }`,
      },
      {
        headerName: '??????',
        field: 'sales',
        valueFormatter: ({ row }) => {
          const totalPrice = (row as LiveShoppingWithGoods).orderItemSupport.reduce(
            (prev, o) => {
              const optTotalPrice = o.orderItem.options.reduce(
                (_p, opt) => _p + Number(opt.discountPrice) * opt.quantity,
                0,
              );
              return prev + optTotalPrice;
            },
            0,
          );
          return `${getLocaleNumber(totalPrice)}???`;
        },
      },
      {
        headerName: '???????????????',
        field: 'liveShoppingVideo.youtubeUrl',
        minWidth: 200,
        renderCell: ({ row }: GridRowData) => {
          if (row.liveShoppingVideo) {
            return (
              <Link
                href={row.liveShoppingVideo?.youtubeUrl || ''}
                isExternal
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
              >
                ???????????? <ExternalLinkIcon mx="2px" />
              </Link>
            );
          }
          return <Text>???????????????</Text>;
        },
      },
    ],
    [StateBoardWindowOpenButton, handleDetailOpenClick],
  );

  const mobileColumns: GridColumns = [
    {
      field: 'liveShoppingName',
      headerName: '????????? ?????????',
      minWidth: 200,
      flex: 1,
      valueFormatter: ({ row }) =>
        row.liveShoppingName || '????????? ???????????? ????????? ?????? ?????? ???, ???????????????.',
    },
    {
      headerName: '',
      field: '',
      width: 80,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: GridRowData) => (
        <Button
          size="xs"
          colorScheme="blue"
          onClick={() => {
            handleDetailOpenClick(row.id);
          }}
        >
          ????????????
        </Button>
      ),
    },
  ];

  return (
    <>
      <Box mb={useSmallSize ? 1 : 24}>
        <ChakraDataGrid
          minH={{ base: 200, md: 300 }}
          disableExtendRowFullWidth
          autoHeight
          pagination
          autoPageSize
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 15]}
          disableSelectionOnClick
          disableColumnMenu
          disableColumnSelector
          columns={isMobileSize ? mobileColumns : columns}
          rows={tableData || []}
        />

        <LiveShoppingDetailDialog
          isOpen={detailIsOpen && !!selectedLiveShopping}
          onClose={detailOnClose}
          liveShopping={selectedLiveShopping}
          type="broadcaster"
        />
      </Box>
    </>
  );
}

export default BroadcasterLiveShoppingList;
