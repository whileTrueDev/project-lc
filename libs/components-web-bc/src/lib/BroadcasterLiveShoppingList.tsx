import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Button, Link, Text, useDisclosure } from '@chakra-ui/react';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { LiveShoppingDetailDialog } from '@project-lc/components-shared/LiveShoppingDetailDialog';
import { LiveShoppingProgressBadge } from '@project-lc/components-shared/LiveShoppingProgressBadge';
import { useDisplaySize, useLiveShoppingList, useProfile } from '@project-lc/hooks';
import { getLiveShoppingProgress, LiveShoppingWithGoods } from '@project-lc/shared-types';
import { liveShoppingStateBoardWindowStore } from '@project-lc/stores';
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
            ['조율중', '취소됨', '등록됨'].includes(shoppingProgress) ||
            Boolean(isMobileSize)
          }
          onClick={openLiveShoppingStateWindow}
        >
          {shoppingProgress === '방송진행중' && '실시간 '}
          {['판매종료', '방송종료'].includes(shoppingProgress) && '지난 '}
          현황
        </Button>
      );
    },
  );

  const columns: GridColumns = useMemo(
    () => [
      {
        headerName: '',
        field: '상세보기',
        width: 90,
        sortable: false,
        disableColumnMenu: true,
        renderCell: ({ row }: GridRowData) => (
          <Button size="xs" colorScheme="blue" onClick={() => handleDetailOpenClick(row)}>
            상세보기
          </Button>
        ),
      },
      {
        headerName: '',
        field: '현황',
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
        headerName: '라이브 쇼핑명',
        minWidth: 350,
        flex: 1,
        valueFormatter: ({ row }) =>
          row.liveShoppingName || '라이브 쇼핑명은 라이브 쇼핑 확정 후, 등록됩니다.',
      },
      {
        field: 'goods_name',
        headerName: '상품명',
        minWidth: 350,
        renderCell: ({ row }) => {
          if (row.externalGoods) {
            return (
              <Link href={row.externalGoods.linkUrl} isExternal>
                {row.externalGoods.name} <ExternalLinkIcon mx="2px" />
              </Link>
            );
          }

          if (row.goods) {
            return <Text>{row.goods.goods_name}</Text>;
          }

          return '';
        },
      },
      {
        field: 'progress',
        headerName: '상태',
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
        headerName: '판매자',
        minWidth: 200,
        valueFormatter: (params) => params.row?.seller.sellerShop.shopName,
      },
      {
        headerName: '방송시간',
        field: '방송시간',
        minWidth: 300,
        renderCell: ({ row }: GridRowData) =>
          `${
            row.broadcastStartDate
              ? dayjs(row.broadcastStartDate).format('YYYY/MM/DD HH:mm')
              : '미정'
          } - ${
            row.broadcastEndDate
              ? dayjs(row.broadcastEndDate).format('YYYY/MM/DD HH:mm')
              : '미정'
          }`,
      },
      {
        headerName: '판매시간',
        field: '판매시간',
        minWidth: 300,
        renderCell: ({ row }: GridRowData) =>
          `${
            row.sellStartDate
              ? dayjs(row.sellStartDate).format('YYYY/MM/DD HH:mm')
              : '미정'
          } - ${
            row.sellEndDate ? dayjs(row.sellEndDate).format('YYYY/MM/DD HH:mm') : '미정'
          }`,
      },
      {
        headerName: '매출',
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
          return `${getLocaleNumber(totalPrice)}원`;
        },
      },
      {
        headerName: '유튜브영상',
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
                보러가기 <ExternalLinkIcon mx="2px" />
              </Link>
            );
          }
          return <Text>업로드대기</Text>;
        },
      },
    ],
    [StateBoardWindowOpenButton, handleDetailOpenClick],
  );

  const mobileColumns: GridColumns = [
    {
      field: 'liveShoppingName',
      headerName: '라이브 쇼핑명',
      minWidth: 200,
      flex: 1,
      valueFormatter: ({ row }) =>
        row.liveShoppingName || '라이브 쇼핑명은 라이브 쇼핑 확정 후, 등록됩니다.',
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
          상세보기
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
