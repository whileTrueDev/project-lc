import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Link,
  Text,
  useDisclosure,
  useToast,
  Tooltip,
  Stack,
} from '@chakra-ui/react';
import { Goods, GoodsConfirmation, LiveShopping, SellerShop } from '@prisma/client';
import {
  useDeleteLiveShopping,
  useFmOrdersDuringLiveShoppingSales,
  useLiveShoppingList,
  useProfile,
} from '@project-lc/hooks';
import { BroadcasterDTOWithoutUserId } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useState } from 'react';
// import { BroadcasterChannelButton } from '..';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import { BroadcasterName } from './BroadcasterName';
import { ConfirmDialog } from './ConfirmDialog';
import { LiveShoppingProgressBadge } from './LiveShoppingProgressBadge';
import { LiveShoppingDetailDialog } from './LiveShoppingDetailDialog';
import { ChakraDataGrid } from '../chakra-extended/ChakraDataGrid';
import BroadcasterChannelButton from './BroadcasterChannelButton';

export interface GoodsWithConfirmation extends Goods {
  confirmation: { confirmation: GoodsConfirmation };
}

export type LiveShoppingWithoutDate = Omit<LiveShopping, 'sellStartDate' | 'sellEndDate'>;

export interface LiveShoppingWithSalesFrontType extends LiveShoppingWithoutDate {
  sellStartDate: string | Date | undefined | null;
  sellEndDate: string | Date | undefined | null;
  sales?: string | null;
  broadcaster: BroadcasterDTOWithoutUserId;
  goods: Pick<GoodsWithConfirmation, 'goods_name' | 'summary'>;
  seller: { sellerShop: SellerShop };
  liveShoppingVideo: { youtubeUrl: string } | null;
}

export function LiveShoppingList(): JSX.Element {
  const toast = useToast();
  const { data: profileData } = useProfile();
  const [pageSize, setPageSize] = useState<number>(5);
  const { data } = useLiveShoppingList({});
  const { data: sales, isLoading: isSalesLoading } = useFmOrdersDuringLiveShoppingSales({
    enabled: !!profileData?.email,
  });

  const liveShoppingWithSales: LiveShoppingWithSalesFrontType[] = [];

  if (data && sales) {
    for (let i = 0; i < data.length; i++) {
      liveShoppingWithSales.push({
        ...data[i],
        ...sales.find((itmInner) => itmInner.id === data[i].id),
      });
    }
  }

  const [isOpen, setIsOpen] = useState(false);

  const [toDeleteLiveShoppingId, setToDeleteLiveShoppingId] = useState(0);
  const [liveShoppingId, setLiveShoppingId] = useState(0);
  const {
    isOpen: detailIsOpen,
    onOpen: detailOnOpen,
    onClose: detailOnClose,
  } = useDisclosure();

  const handleDetailOnOpen = (id: number): void => {
    const index = liveShoppingWithSales?.findIndex((x) => x.id === id) || 0;
    setLiveShoppingId(index);
    detailOnOpen();
  };

  const handleModalOpen = (id: number): void => {
    setIsOpen(true);
    setToDeleteLiveShoppingId(id);
  };

  const onClose = (): void => {
    setIsOpen(false);
  };

  const { mutateAsync } = useDeleteLiveShopping();
  const deleteLiveShopping = async (): Promise<void> => {
    mutateAsync(toDeleteLiveShoppingId)
      .then((isDeleted) => {
        if (isDeleted) {
          toast({
            title: '삭제 완료하였습니다',
            status: 'success',
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 401) {
          toast({
            title: '삭제 오류',
            description: error.response.data.message,
            status: 'error',
          });
        } else {
          toast({
            title: '삭제 오류',
            status: 'error',
          });
        }
      });
  };

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
      field: 'broadcaster',
      headerName: '방송인',
      minWidth: 200,
      flex: 1,
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
    {
      headerName: '',
      field: '',
      width: 140,
      renderCell: ({ row }: GridRowData) => (
        <Stack direction="row">
          <Button
            size="xs"
            colorScheme="blue"
            onClick={() => {
              handleDetailOnOpen(row.id);
            }}
          >
            상세보기
          </Button>
          {row.progress === 'registered' ? (
            <Button
              size="xs"
              colorScheme="orange"
              onClick={() => {
                handleModalOpen(row.id);
              }}
            >
              삭제
            </Button>
          ) : null}
        </Stack>
      ),
    },
  ];

  return (
    <Box minHeight={{ base: 300, md: 600 }} mb={24}>
      {data && liveShoppingWithSales && (
        <>
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

          <LiveShoppingDetailDialog
            isOpen={detailIsOpen}
            onClose={detailOnClose}
            data={data}
            id={liveShoppingId}
            type="seller"
          />

          <ConfirmDialog
            title="라이브 쇼핑 삭제"
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={deleteLiveShopping}
          >
            <Text>삭제하시겠습니까?</Text>
          </ConfirmDialog>
        </>
      )}
    </Box>
  );
}

export default LiveShoppingList;
