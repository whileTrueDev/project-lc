import { useMemo, useState } from 'react';
import { useTable, usePagination } from 'react-table';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  IconButton,
  Text,
  Tooltip,
  Select,
  Box,
  Stack,
  Button,
  Link,
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
} from '@chakra-ui/react';
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ExternalLinkIcon,
} from '@chakra-ui/icons';
import { LIVE_SHOPPING_PROGRESS } from '@project-lc/shared-types';
import {
  useBroadcasterFmOrdersDuringLiveShoppingSales,
  useBroadcasterLiveShoppingList,
  useProfile,
} from '@project-lc/hooks';
import dayjs from 'dayjs';
import { LiveShoppingProgressBadge } from './LiveShoppingProgressBadge';

export function BroadcasterLiveShoppingList(): JSX.Element {
  const { data: profileData } = useProfile();
  const [liveShoppingId, setLiveShoppingId] = useState(0);

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

  const handleDetailOnOpen = (id: number): void => {
    setLiveShoppingId(id);
    detailOnOpen();
  };

  const liveShoppingWithSales: any[] = [];

  if (tableData && salesData) {
    for (let i = 0; i < tableData.length; i++) {
      liveShoppingWithSales.push({
        ...tableData[i],
        ...salesData.find((itmInner) => itmInner.id === tableData[i].id),
      });
    }
  }
  const columns = useMemo(
    () => [
      {
        Header: '상품명',
        accessor: 'goods.confirmation.firstmallGoodsConnectionId',
        Cell: ({ _, row }: any) => {
          return (
            <Tooltip label="상품페이지로 이동">
              <Link
                href={`http://whiletrue.firstmall.kr/goods/view?no=${row.original.goods.confirmation.firstmallGoodsConnectionId}`}
                isExternal
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
              >
                {row.original.goods.goods_name} <ExternalLinkIcon mx="2px" />
              </Link>
            </Tooltip>
          );
        },
      },
      {
        Header: '상태',
        accessor: 'progress',
        Cell: ({ _, row }: any) => {
          return (
            <LiveShoppingProgressBadge
              progress={row.progress}
              broadcastStartDate={row.broadcastStartDate}
              broadcastEndDate={row.broadcastEndDate}
              sellEndDate={row.sellEndDate}
            />
          );
        },
      },
      {
        Header: '판매자',
        accessor: 'seller.sellerShop.shopName',
      },
      {
        Header: '방송시간',
        accessor: (row: any) =>
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
        Header: '판매시간',
        accessor: (row: any) =>
          `${
            row.sellStartDate
              ? dayjs(row.sellStartDate).format('YYYY/MM/DD HH:mm')
              : '미정'
          } - ${
            row.sellEndDate ? dayjs(row.sellEndDate).format('YYYY/MM/DD HH:mm') : '미정'
          }`,
      },
      {
        Header: '매출',
        accessor: (row: any) =>
          `${row.sales ? row.sales.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}원`,
      },
      {
        // 'liveShoppingVideo.youtubeUrl'
        Header: '유튜브영상',
        accessor: 'liveShoppingVideo.youtubeUrl',
        Cell: ({ value, row }: any) => {
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
        Header: () => null,
        id: 'detail',
        Cell: ({ _, row }: any) => (
          <Button
            size="xs"
            colorScheme="blue"
            onClick={() => handleDetailOnOpen(row.index)}
          >
            상세보기
          </Button>
        ),
      },
    ],
    [],
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: liveShoppingWithSales,
      autoResetSortBy: false,
      autoResetPage: false,
      initialState: { pageIndex: 0 },
    },
    usePagination,
  );
  return (
    <Box p={5}>
      {tableData && !isLoading && (
        <Table {...getTableProps()}>
          <Thead>
            {console.log(headerGroups)}
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <Th key={column}>{column.render('Header')}</Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={row.id}>
                  {row.cells.map((cell) => {
                    return <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>;
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      )}
      <Flex justifyContent="space-between" m={4} alignItems="center">
        <Flex />
        <Stack direction="row" alignItems="center">
          <Tooltip label="맨 앞으로">
            <IconButton
              aria-label="very-front"
              onClick={() => gotoPage(0)}
              isDisabled={!canPreviousPage}
              icon={<ArrowLeftIcon h={3} w={3} />}
            />
          </Tooltip>
          <Tooltip label="이전 페이지">
            <IconButton
              aria-label="front"
              onClick={previousPage}
              isDisabled={!canPreviousPage}
              icon={<ChevronLeftIcon h={6} w={6} />}
            />
          </Tooltip>
          {[...Array(pageOptions.length)].map((e, i) => {
            return pageIndex === i ? (
              <Text
                key={i}
                fontWeight="bold"
                as="ins"
                cursor="pointer"
                size="2xl"
                onClick={() => {
                  gotoPage(i);
                }}
              >
                {i + 1}
              </Text>
            ) : (
              <Text
                key={i}
                cursor="pointer"
                size="2xl"
                onClick={() => {
                  gotoPage(i);
                }}
              >
                {i + 1}
              </Text>
            );
          })}
          <Tooltip label="다음 페이지">
            <IconButton
              aria-label="next"
              onClick={nextPage}
              isDisabled={!canNextPage}
              icon={<ChevronRightIcon h={6} w={6} />}
            />
          </Tooltip>
          <Tooltip label="맨 뒤로">
            <IconButton
              aria-label="very-next"
              onClick={() => gotoPage(pageCount - 1)}
              isDisabled={!canNextPage}
              icon={<ArrowRightIcon h={3} w={3} />}
            />
          </Tooltip>
        </Stack>
        <Flex alignItems="center">
          <Select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 15].map((num) => (
              <option key={num} value={num}>
                {num}개씩 보기
              </option>
            ))}
          </Select>
        </Flex>
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
