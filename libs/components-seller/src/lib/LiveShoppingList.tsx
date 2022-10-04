import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Link,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import {
  Broadcaster,
  BroadcasterPromotionPage,
  Goods,
  GoodsConfirmation,
  LiveShopping,
  SellerShop,
} from '@prisma/client';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import BroadcasterChannelButton from '@project-lc/components-shared/BroadcasterChannelButton';
import { BroadcasterName } from '@project-lc/components-shared/BroadcasterName';
import { LiveShoppingDetailDialog } from '@project-lc/components-shared/LiveShoppingDetailDialog';
import { LiveShoppingProgressBadge } from '@project-lc/components-shared/LiveShoppingProgressBadge';
import {
  useDeleteLiveShopping,
  useDisplaySize,
  useLiveShoppingList,
  useProfile,
} from '@project-lc/hooks';
import { LiveShoppingWithGoods } from '@project-lc/shared-types';
import { getCustomerWebHost } from '@project-lc/utils';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import { useState } from 'react';

export interface GoodsWithConfirmation extends Goods {
  confirmation: { confirmation: GoodsConfirmation };
}

export type LiveShoppingWithoutDate = Omit<LiveShopping, 'sellStartDate' | 'sellEndDate'>;

export interface LiveShoppingWithSalesFrontType extends LiveShoppingWithoutDate {
  sellStartDate: string | Date | undefined | null;
  sellEndDate: string | Date | undefined | null;
  sales?: string | null;
  broadcaster: Pick<
    Broadcaster,
    'id' | 'userName' | 'userNickname' | 'email' | 'avatar'
  > & {
    BroadcasterPromotionPage: BroadcasterPromotionPage | null;
  };
  goods: Pick<GoodsWithConfirmation, 'goods_name' | 'summary'>;
  seller: { sellerShop: SellerShop };
  liveShoppingVideo: { youtubeUrl: string } | null;
}

export function LiveShoppingList(): JSX.Element {
  const toast = useToast();
  const { isMobileSize } = useDisplaySize();
  const { data: profile } = useProfile();
  const { data, isLoading } = useLiveShoppingList(
    { sellerId: profile?.id },
    { enabled: !!profile && !!profile?.id },
  );

  const [pageSize, setPageSize] = useState<number>(5);

  const deleteDialog = useDisclosure();
  const [toDeleteLiveShoppingId, setToDeleteLiveShoppingId] = useState(0);
  const [selectedLiveShopping, setSelectedLiveShopping] =
    useState<LiveShoppingWithGoods>();
  const {
    isOpen: detailIsOpen,
    onOpen: detailOnOpen,
    onClose: detailOnClose,
  } = useDisclosure();

  const handleDetailOnOpen = (row: LiveShoppingWithGoods): void => {
    setSelectedLiveShopping(row);
    detailOnOpen();
  };

  const handleDeleteClick = (id: number): void => {
    deleteDialog.onOpen();
    setToDeleteLiveShoppingId(id);
  };

  const { mutateAsync } = useDeleteLiveShopping();
  const deleteLiveShopping = async (): Promise<void> => {
    mutateAsync(toDeleteLiveShoppingId)
      .then((isDeleted) => {
        if (isDeleted) toast({ description: '삭제 완료하였습니다', status: 'success' });
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 401) {
          toast({
            title: '삭제 오류',
            description: error.response.data.message,
            status: 'error',
          });
        } else {
          toast({ title: '삭제 오류', status: 'error' });
        }
      });
  };
  const columns: GridColumns = [
    {
      headerName: '',
      field: '',
      width: 140,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: GridRowData) => (
        <Stack direction="row">
          <Button size="xs" colorScheme="blue" onClick={() => handleDetailOnOpen(row)}>
            상세보기
          </Button>
          {row.progress === 'registered' ? (
            <Button
              size="xs"
              colorScheme="orange"
              onClick={() => handleDeleteClick(row.id)}
            >
              삭제
            </Button>
          ) : null}
        </Stack>
      ),
    },
    {
      field: 'liveShoppingName',
      headerName: '라이브 쇼핑명',
      minWidth: 250,
      flex: 1,
      valueFormatter: ({ row }) =>
        row.liveShoppingName || '(라이브쇼핑 진행 확정 후 등록예정)',
    },
    {
      field: 'goods_name',
      headerName: '상품명',
      minWidth: 350,
      flex: 1,
      renderCell: ({ row }) => {
        // 크크쇼 상품이 연결된 라이브쇼핑인 경우
        if (row.goods) {
          // 검수 안된 상품인 경우 링크x
          if (
            !row.goods?.confirmation ||
            row.goods?.confirmation?.status !== 'confirmed'
          ) {
            return (
              <Text>
                <Text as="span" fontSize="xs">
                  (검수미완료)
                </Text>{' '}
                {row.goods.goods_name}
              </Text>
            );
          }
          return (
            <Tooltip label="상품페이지로 이동">
              <Link href={`${getCustomerWebHost()}/goods/${row.goodsId}`} isExternal>
                {row.goods.goods_name} <ExternalLinkIcon mx="2px" />{' '}
              </Link>
            </Tooltip>
          );
        }
        // 외부상품인 경우
        if (row.externalGoods) {
          return (
            <Tooltip label="상품페이지로 이동">
              <Link href={row.externalGoods.linkUrl} isExternal>
                {row.externalGoods.name} <ExternalLinkIcon mx="2px" />{' '}
              </Link>
            </Tooltip>
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
      field: 'broadcaster',
      headerName: '방송인',
      minWidth: 200,
      renderCell: ({ row }: GridRowData) => (
        <Flex alignItems="center">
          <Box mr={1}>
            <BroadcasterName data={row.broadcaster} />
          </Box>
          <BroadcasterChannelButton channelUrl={row.broadcaster?.channels[0]?.url} />
        </Flex>
      ),
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
      minWidth: 150,
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
        <Stack direction="column">
          <Button
            size="xs"
            colorScheme="blue"
            onClick={() => {
              handleDetailOnOpen(row.id);
            }}
          >
            상세보기
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box mb={24}>
      <ChakraDataGrid
        minHeight={300}
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
        loading={isLoading}
        columns={isMobileSize ? mobileColumns : columns}
        rows={data || []}
      />

      <LiveShoppingDetailDialog
        isOpen={detailIsOpen}
        onClose={detailOnClose}
        liveShopping={selectedLiveShopping}
        type="seller"
      />

      <ConfirmDialog
        title="라이브 쇼핑 삭제"
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.onClose}
        onConfirm={deleteLiveShopping}
      >
        <Text>삭제하시겠습니까?</Text>
      </ConfirmDialog>
    </Box>
  );
}
