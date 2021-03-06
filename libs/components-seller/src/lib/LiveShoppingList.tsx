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
  const { data, isLoading } = useLiveShoppingList({ sellerId: profile?.id });

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
        if (isDeleted) toast({ description: '?????? ?????????????????????', status: 'success' });
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 401) {
          toast({
            title: '?????? ??????',
            description: error.response.data.message,
            status: 'error',
          });
        } else {
          toast({ title: '?????? ??????', status: 'error' });
        }
      });
  };
  const columns: GridColumns = [
    {
      field: 'liveShoppingName',
      headerName: '????????? ?????????',
      minWidth: 250,
      flex: 1,
      valueFormatter: ({ row }) =>
        row.liveShoppingName || '(????????? ???????????? ????????? ?????? ?????? ???, ???????????????.)',
    },
    {
      field: 'goods_name',
      headerName: '?????????',
      minWidth: 350,
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <Tooltip label="?????????????????? ??????">
            <Link href={`${getCustomerWebHost()}/goods/${row.goodsId}`} isExternal>
              {row.goods.goods_name} <ExternalLinkIcon mx="2px" />
            </Link>
          </Tooltip>
        );
      },
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
      field: 'broadcaster',
      headerName: '?????????',
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
          row.sellStartDate ? dayjs(row.sellStartDate).format('YYYY/MM/DD HH:mm') : '??????'
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
              ???????????? <ExternalLinkIcon mx="2px" />
            </Link>
          );
        }
        return <Text>???????????????</Text>;
      },
    },
    {
      headerName: '',
      field: '',
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: GridRowData) => (
        <Stack direction="row">
          <Button size="xs" colorScheme="blue" onClick={() => handleDetailOnOpen(row)}>
            ????????????
          </Button>
          {row.progress === 'registered' ? (
            <Button
              size="xs"
              colorScheme="orange"
              onClick={() => handleDeleteClick(row.id)}
            >
              ??????
            </Button>
          ) : null}
        </Stack>
      ),
    },
  ];

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
        <Stack direction="column">
          <Button
            size="xs"
            colorScheme="blue"
            onClick={() => {
              handleDetailOnOpen(row.id);
            }}
          >
            ????????????
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
        title="????????? ?????? ??????"
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.onClose}
        onConfirm={deleteLiveShopping}
      >
        <Text>?????????????????????????</Text>
      </ConfirmDialog>
    </Box>
  );
}
