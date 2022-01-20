import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Link, Text, Tooltip, useDisclosure } from '@chakra-ui/react';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { LiveShoppingDetailDialog } from '@project-lc/components-shared/LiveShoppingDetailDialog';
import { LiveShoppingProgressBadge } from '@project-lc/components-shared/LiveShoppingProgressBadge';
import {
  useBroadcasterFmOrdersDuringLiveShoppingSales,
  useBroadcasterLiveShoppingList,
  useProfile,
  useDisplaySize,
} from '@project-lc/hooks';
import dayjs from 'dayjs';
import { useState } from 'react';

export function BroadcasterLiveShoppingList({
  useSmallSize = false,
}: {
  useSmallSize?: boolean;
}): JSX.Element {
  const { data: profileData } = useProfile();
  const [liveShoppingId, setLiveShoppingId] = useState(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const { isMobileSize } = useDisplaySize();

  const { data: tableData } = useBroadcasterLiveShoppingList({
    broadcasterId: profileData?.id,
  });

  const { data: salesData, isLoading: isSalesLoading } =
    useBroadcasterFmOrdersDuringLiveShoppingSales({
      broadcasterId: profileData?.id,
    });

  const {
    isOpen: detailIsOpen,
    onOpen: detailOnOpen,
    onClose: detailOnClose,
  } = useDisclosure();

  const handleDetailOpenClick = (id: number): void => {
    const index = tableData?.findIndex((x) => x.id === id) || 0;
    setLiveShoppingId(index);
    detailOnOpen();
  };

  const liveShoppingWithSales = [];

  if (tableData && salesData) {
    for (let i = 0; i < tableData.length; i++) {
      liveShoppingWithSales.push({
        ...tableData[i],
        ...salesData.find((itmInner) => itmInner.id === tableData[i].id),
      });
    }
  }

  const columns: GridColumns = [
    {
      field: 'liveShoppingName',
      headerName: '라이브 쇼핑명',
      minWidth: 350,
      flex: 1,
      valueFormatter: ({ row }) =>
        row.liveShoppingName || '라이브 쇼핑명은 라이브 쇼핑 확정 후, 등록됩니다.',
    },
    {
      field: 'fmGoodsSeq',
      headerName: '상품명',
      minWidth: 350,
      renderCell: ({ row }) =>
        new Date(row.sellEndDate) > new Date() && row.fmGoodsSeq ? (
          <Tooltip label="상품페이지로 이동">
            <Link
              href={`http://whiletrue.firstmall.kr/goods/view?no=${row.fmGoodsSeq}`}
              isExternal
            >
              {row.goods.goods_name} <ExternalLinkIcon mx="2px" />
            </Link>
          </Tooltip>
        ) : (
          <Text>{row.goods.goods_name}</Text>
        ),
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
          row.sellStartDate ? dayjs(row.sellStartDate).format('YYYY/MM/DD HH:mm') : '미정'
        } - ${
          row.sellEndDate ? dayjs(row.sellEndDate).format('YYYY/MM/DD HH:mm') : '미정'
        }`,
    },
    {
      headerName: '매출',
      field: 'sales',
      valueFormatter: ({ row }) =>
        `${row.sales ? row.sales.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}원`,
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
    <Box minHeight={useSmallSize ? 0 : { base: 300, md: 600 }} mb={useSmallSize ? 1 : 24}>
      {liveShoppingWithSales && (
        <>
          <Flex m={4}>
            <ChakraDataGrid
              disableExtendRowFullWidth
              autoHeight
              pagination
              autoPageSize
              showFirstButton
              showLastButton
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 15]}
              disableSelectionOnClick
              disableColumnMenu
              disableColumnSelector
              loading={isSalesLoading}
              columns={isMobileSize ? mobileColumns : columns}
              rows={liveShoppingWithSales}
            />
          </Flex>
        </>
      )}

      {liveShoppingWithSales && liveShoppingWithSales.length !== 0 && (
        <LiveShoppingDetailDialog
          isOpen={detailIsOpen}
          onClose={detailOnClose}
          data={liveShoppingWithSales}
          id={liveShoppingId}
          type="broadcaster"
        />
      )}
    </Box>
  );
}

export default BroadcasterLiveShoppingList;
