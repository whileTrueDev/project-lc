import { useState } from 'react';
import {
  Box,
  Button,
  Link,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Divider,
  Textarea,
  Flex,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import {
  useBroadcasterFmOrdersDuringLiveShoppingSales,
  useBroadcasterLiveShoppingList,
  useProfile,
} from '@project-lc/hooks';
import dayjs from 'dayjs';
import { LIVE_SHOPPING_PROGRESS } from '@project-lc/shared-types';
import { LiveShoppingProgressBadge } from './LiveShoppingProgressBadge';
import { ChakraDataGrid } from './ChakraDataGrid';

export function BroadcasterLiveShoppingList(): JSX.Element {
  const { data: profileData } = useProfile();
  const [liveShoppingId, setLiveShoppingId] = useState(0);
  const [pageSize, setPageSize] = useState<number>(5);

  const { data: tableData, isLoading } = useBroadcasterLiveShoppingList({
    broadcasterId: profileData?.id || 0,
    enabled: !!profileData?.id,
  });

  const { data: salesData, isLoading: isSalesLoading } =
    useBroadcasterFmOrdersDuringLiveShoppingSales({
      broadcasterId: profileData?.id || 0,
      enabled: !!profileData?.id,
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
      field: 'goods.confirmation.firstmallGoodsConnectionId',
      headerName: '상품명',
      minWidth: 350,
      flex: 1,
      renderCell: ({ row }) => (
        <Tooltip label="상품페이지로 이동">
          <Link
            href={`http://whiletrue.firstmall.kr/goods/view?no=${row.goods.confirmation.firstmallGoodsConnectionId}`}
            isExternal
          >
            {row.goods.goods_name} <ExternalLinkIcon mx="2px" />
          </Link>
        </Tooltip>
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
      flex: 1,
      valueFormatter: (params) => params.row?.seller.sellerShop.shopName,
    },
    {
      headerName: '방송시간',
      field: '방송시간',
      minWidth: 300,
      flex: 1,
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
      flex: 1,
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
    <Box minHeight={{ base: 300, md: 600 }} mb={24}>
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
          columns={columns}
          rows={liveShoppingWithSales}
        />
      </Flex>
      {tableData &&
        tableData.length !== 0 &&
        !isLoading &&
        liveShoppingWithSales &&
        !isSalesLoading && (
          <Modal isOpen={detailIsOpen} onClose={detailOnClose} size="lg">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>상세정보</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing={4}>
                  <Stack direction="row" alignItems="center">
                    {tableData[liveShoppingId]?.seller.sellerShop && (
                      <>
                        <Text as="span">판매자: </Text>
                        <Text as="span">
                          {tableData[liveShoppingId].seller.sellerShop.shopName}
                        </Text>
                      </>
                    )}
                  </Stack>

                  <Stack direction="row" alignItems="center">
                    <Text as="span">상품명: </Text>
                    <Text as="span">{tableData[liveShoppingId].goods.goods_name}</Text>
                  </Stack>

                  <Stack direction="row" alignItems="center">
                    <Text as="span">진행상태</Text>
                    <LiveShoppingProgressBadge
                      progress={tableData[liveShoppingId].progress}
                      broadcastStartDate={tableData[liveShoppingId].broadcastStartDate}
                      broadcastEndDate={tableData[liveShoppingId].broadcastEndDate}
                      sellEndDate={tableData[liveShoppingId].sellEndDate}
                    />
                    {tableData[liveShoppingId].progress ===
                    LIVE_SHOPPING_PROGRESS.취소됨 ? (
                      <Text>사유 : {tableData[liveShoppingId].rejectionReason}</Text>
                    ) : null}
                  </Stack>
                  <Divider />

                  <Stack direction="row" alignItems="center">
                    <Text as="span">방송시작 시간: </Text>
                    <Text as="span" fontWeight="bold">
                      {tableData[liveShoppingId].broadcastStartDate
                        ? dayjs(tableData[liveShoppingId].broadcastStartDate).format(
                            'YYYY/MM/DD HH:mm',
                          )
                        : '미정'}
                    </Text>
                  </Stack>

                  <Stack direction="row" alignItems="center">
                    <Text as="span">방송종료 시간: </Text>
                    <Text as="span" fontWeight="bold">
                      {tableData[liveShoppingId].broadcastEndDate
                        ? dayjs(tableData[liveShoppingId].broadcastEndDate).format(
                            'YYYY/MM/DD HH:mm',
                          )
                        : '미정'}
                    </Text>
                  </Stack>

                  <Divider />
                  <Stack direction="row" alignItems="center">
                    <Text as="span">판매시작 시간: </Text>
                    <Text as="span" fontWeight="bold">
                      {tableData[liveShoppingId].sellStartDate
                        ? dayjs(tableData[liveShoppingId].sellStartDate).format(
                            'YYYY/MM/DD HH:mm',
                          )
                        : '미정'}
                    </Text>
                  </Stack>

                  <Stack direction="row" alignItems="center">
                    <Text as="span">판매종료 시간: </Text>
                    <Text as="span" fontWeight="bold">
                      {tableData[liveShoppingId].sellEndDate
                        ? dayjs(tableData[liveShoppingId].sellEndDate).format(
                            'YYYY/MM/DD HH:mm',
                          )
                        : '미정'}
                    </Text>
                  </Stack>

                  <Divider />
                  <Stack direction="row" alignItems="center">
                    <Text as="span">방송인 수수료: </Text>
                    <Text as="span" fontWeight="bold">
                      {tableData[liveShoppingId].broadcasterCommissionRate
                        ? `${tableData[liveShoppingId].broadcasterCommissionRate}%`
                        : '미정'}
                    </Text>
                  </Stack>

                  <Stack>
                    <Text>요청사항</Text>
                    <Textarea
                      resize="none"
                      rows={10}
                      value={tableData[liveShoppingId].requests || ''}
                      readOnly
                    />
                  </Stack>
                </Stack>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" onClick={detailOnClose}>
                  닫기
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
    </Box>
  );
}

export default BroadcasterLiveShoppingList;
