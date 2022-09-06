import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Button, Heading, Link, LinkProps, Text, Tooltip } from '@chakra-ui/react';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import { GoodsConfirmationStatuses } from '@prisma/client';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { LiveShoppingProgressBadge } from '@project-lc/components-shared/LiveShoppingProgressBadge';
import { useAdminLiveShoppingList, useProfile } from '@project-lc/hooks';
import { getLiveShoppingProgress, LiveShoppingWithGoods } from '@project-lc/shared-types';
import { getCustomerWebHost } from '@project-lc/utils';
import dayjs from 'dayjs';
import { forwardRef } from 'react';

/** Tooltip 이 functional component 감싸는 경우 forwardRef 사용해 ref 전달하도록 해야한다고 함
 * https://chakra-ui.com/docs/components/tooltip/usage#usage
 */
const CustomNameLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ children, ...rest }, ref) => (
    <Link ref={ref} {...rest}>
      {children}
    </Link>
  ),
);

export function AdminLiveShoppingList({
  onRowClick,
}: {
  onRowClick: (liveShoppingId: number) => void;
}): JSX.Element {
  const { data: profileData } = useProfile();
  const { data, isLoading } = useAdminLiveShoppingList(
    {},
    { enabled: !!profileData?.id },
  );

  function handleClick(row: LiveShoppingWithGoods): void {
    onRowClick(row.id);
  }
  const columns: GridColumns = [
    { field: 'id', width: 50 },
    {
      field: 'liveShoppingName',
      headerName: '라이브 쇼핑명',
      minWidth: 350,
      flex: 1,
      renderCell: ({ row }) => (
        <Tooltip label="상세페이지로 이동">
          <CustomNameLink href={`/live-shopping/${row.id}`}>
            {row.liveShoppingName ||
              '라이브 쇼핑명은 라이브 쇼핑 확정 후, 등록하면 됩니다.'}
          </CustomNameLink>
        </Tooltip>
      ),
    },
    {
      field: 'createDate',
      headerName: '등록일자',
      minWidth: 150,
      valueFormatter: ({ row }) => dayjs(row.createDate).format('YYYY/MM/DD HH:mm'),
    },
    {
      field: 'goodsName',
      headerName: '상품명',
      minWidth: 350,
      renderCell: ({ row }) => {
        const withExternalGoods = !!row.externalGoods;
        const withKkshowGoods = !!row.goods;

        if (withExternalGoods) {
          return (
            <CustomNameLink href={row.externalGoods.linkUrl} isExternal>
              <Text as="span" color="red" fontSize="xs">
                [외부상품]
              </Text>
              {row.externalGoods.name}
              <ExternalLinkIcon mx="2px" />
            </CustomNameLink>
          );
        }

        if (withKkshowGoods) {
          if (new Date(row.sellEndDate) > new Date()) {
            return (
              <Tooltip label="상품페이지로 이동">
                <CustomNameLink
                  href={`${getCustomerWebHost()}/goods/${row.goodsId}`}
                  isExternal
                >
                  {row.goods.goods_name}
                  <ExternalLinkIcon mx="2px" />
                </CustomNameLink>
              </Tooltip>
            );
          }

          let confirmationStateText = '';
          if (
            !row.goods.confirmation ||
            row.goods.confirmation?.status === GoodsConfirmationStatuses.waiting ||
            row.goods.confirmation?.status ===
              GoodsConfirmationStatuses.needReconfirmation
          ) {
            confirmationStateText = '(검수미완료) ';
          }
          if (row.goods.confirmation?.status === GoodsConfirmationStatuses.rejected) {
            confirmationStateText = '(검수거절상품) ';
          }

          return (
            <Text>
              <Text as="span" color="red" fontSize="xs">
                {confirmationStateText}
              </Text>
              {row.goods.goods_name}
            </Text>
          );
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
          row.sellStartDate ? dayjs(row.sellStartDate).format('YYYY/MM/DD HH:mm') : '미정'
        } - ${
          row.sellEndDate ? dayjs(row.sellEndDate).format('YYYY/MM/DD HH:mm') : '미정'
        }`,
    },
    {
      headerName: '선물 목록 조회',
      field: '',
      renderCell: ({ row }: GridRowData) => (
        <Button
          size="xs"
          onClick={() => {
            handleClick(row);
          }}
          isDisabled={!checkGiftList(row)}
        >
          선물 목록 조회
        </Button>
      ),
    },
  ];
  // 선물 목록을 조회할 수 있는 라이브커머스의 조건
  function checkGiftList(row: LiveShoppingWithGoods): boolean {
    const progress = getLiveShoppingProgress({
      progress: row.progress,
      broadcastStartDate: row.broadcastStartDate,
      broadcastEndDate: row.broadcastEndDate,
      sellEndDate: row.sellEndDate,
    });
    return ['판매종료', '방송진행중', '방송종료', '확정됨'].includes(progress);
  }

  return (
    <Box p={5}>
      <Heading size="md">라이브 쇼핑 리스트</Heading>
      {data && (
        <>
          <ChakraDataGrid
            disableExtendRowFullWidth
            autoHeight
            pagination
            autoPageSize
            disableSelectionOnClick
            disableColumnMenu
            disableColumnSelector
            loading={isLoading}
            columns={columns}
            rows={data}
          />
        </>
      )}
    </Box>
  );
}
