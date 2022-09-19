import { Button } from '@chakra-ui/button';
import { InfoIcon } from '@chakra-ui/icons';
import { Box, Grid, Heading, Stack, Text } from '@chakra-ui/layout';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { useDisclosure } from '@chakra-ui/react';
import { GridCellParams, GridColumns } from '@material-ui/data-grid';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import TextWithPopperButton from '@project-lc/components-core/TextWithPopperButton';
import { GridTableItem } from '@project-lc/components-layout/GridTableItem';
import SellTypeBadge from '@project-lc/components-shared/SellTypeBadge';
import { YouCanHorizontalScrollText } from '@project-lc/components-shared/YouCanHorizontalScrollText';
import {
  useBroadcasterSettlementHistory,
  useDisplaySize,
  useProfile,
} from '@project-lc/hooks';
import { FindBcSettlementHistoriesRes } from '@project-lc/shared-types';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';

/** 방송인 별 정산 완료 목록 */
export function BcSettlementHistoryBox(): JSX.Element {
  const profile = useProfile();
  const { data } = useBroadcasterSettlementHistory(profile.data?.id);
  return (
    <Box borderWidth="thin" borderRadius="lg" p={7} height="100%">
      <TextWithPopperButton
        title={
          <Text fontSize="lg" fontWeight="medium">
            정산 완료 목록
          </Text>
        }
        iconAriaLabel="settlement-done-list-help"
        icon={<InfoIcon />}
      >
        <YouCanHorizontalScrollText />
      </TextWithPopperButton>

      <BcSettlementHistory data={data} disableHeaders={['broadcaster']} />
    </Box>
  );
}

type ColHeader = 'round' | 'date' | 'totalAmount' | 'broadcaster';
export interface BcSettlementHistoryProps {
  data?: FindBcSettlementHistoriesRes;
  disableHeaders?: Array<ColHeader>;
  pageSize?: number;
}
/** 정산 완료 목록 데이터그리드 */
export function BcSettlementHistory({
  data,
  disableHeaders,
  pageSize = 5,
}: BcSettlementHistoryProps): JSX.Element {
  const { isDesktopSize } = useDisplaySize();
  const detailDialog = useDisclosure();
  const [selected, setSelected] = useState<FindBcSettlementHistoriesRes[number] | null>(
    null,
  );
  const columns = useMemo<GridColumns>(
    () => [
      {
        headerName: '방송인',
        field: 'broadcaster',
        width: 130,
        valueFormatter: ({ row }) => row.broadcaster.userNickname,
      },
      {
        headerName: '회차',
        field: 'round',
        width: 100,
      },
      {
        headerName: '정산일',
        field: 'date',
        width: 180,
        flex: isDesktopSize ? 1 : undefined,
        valueFormatter: ({ value }) =>
          dayjs(value as string).format('YYYY년MM월DD일 HH시'),
      },
      {
        width: 140,
        sortable: false,
        headerName: '총 정산 금액',
        field: 'totalAmount',
        renderCell: TotalAmountCell,
        flex: isDesktopSize ? 1 : undefined,
      },
      {
        headerName: '',
        field: '',
        width: 80,
        sortable: false,
        renderCell: ({ row }) => (
          <Button
            size="xs"
            onClick={() => {
              detailDialog.onOpen();
              setSelected(row as FindBcSettlementHistoriesRes[number]);
            }}
          >
            자세히보기
          </Button>
        ),
      },
    ],
    [detailDialog, isDesktopSize],
  );
  return (
    <Box minH={300}>
      <ChakraDataGrid
        mt={4}
        disableSelectionOnClick
        disableColumnMenu
        density="compact"
        autoHeight
        pageSize={pageSize}
        rowsPerPageOptions={[pageSize]}
        columns={
          disableHeaders
            ? columns.filter((col) => !disableHeaders.includes(col.field as ColHeader))
            : columns
        }
        rows={data || []}
      />

      {selected && (
        <SettlementHistoryDetailDialog
          isOpen={detailDialog.isOpen}
          onClose={detailDialog.onClose}
          data={selected}
        />
      )}
    </Box>
  );
}

/** 방송인 정산 내역의 총 정산금액 구하는 훅 */
const useBroadcasterSettlementTotalAmount = (
  settlement: FindBcSettlementHistoriesRes[number],
): number => {
  return useMemo(() => {
    return (
      settlement as FindBcSettlementHistoriesRes[number]
    ).broadcasterSettlementItems.reduce(
      (prev, item) => (prev ? prev + item.amount : item.amount),
      0,
    );
  }, [settlement]);
};

/** 정산 완료 목록 데이터그리드 BcSettlementHistory의 총 정산 금액 셀 컴포넌트 */
function TotalAmountCell({ row }: GridCellParams): JSX.Element {
  const totalAmount = useBroadcasterSettlementTotalAmount(
    row as FindBcSettlementHistoriesRes[number],
  );
  return <Text>{`${getLocaleNumber(totalAmount)}원`}</Text>;
}

interface SettlementHistoryDetailProps {
  data: FindBcSettlementHistoriesRes[number];
}
/** 방송인 수익 정산 상세 정보 */
export function SettlementHistoryDetail({
  data,
}: SettlementHistoryDetailProps): JSX.Element {
  const totalAmount = useBroadcasterSettlementTotalAmount(data);
  const infos = useMemo(
    () => [
      { title: '정산회차', value: data.round },
      { title: '정산일', value: dayjs(data.date).format('YYYY년MM월DD일 HH시') },
      {
        title: '총 정산액',
        value: totalAmount ? `${getLocaleNumber(totalAmount)}원` : '-',
      },
    ],
    [data.date, data.round, totalAmount],
  );

  // * 라이브쇼핑 정보 렌더 함수
  type settlementItemType =
    FindBcSettlementHistoriesRes[number]['broadcasterSettlementItems'][number];
  const renderLiveShoppingInfo = useCallback(
    (item: settlementItemType) => (
      <>
        <GridTableItem title="라이브쇼핑 고유번호" value={item.liveShopping.id} />
        <GridTableItem
          title="라이브쇼핑명"
          value={item.liveShopping?.liveShoppingName || ''}
        />
        <GridTableItem
          title="판매기간"
          value={
            <Box>
              <Text>
                {dayjs(item.liveShopping.sellStartDate).format('YYYY/MM/DD HH시 mm분')}{' '}
                부터
              </Text>
              <Text>
                {dayjs(item.liveShopping.sellEndDate).format('YYYY/MM/DD HH시 mm분')} 까지
              </Text>
            </Box>
          }
        />
        <GridTableItem
          title="정산액 및 수수료율"
          value={`${getLocaleNumber(
            item.amount,
          )}원 (${item.liveShopping.broadcasterCommissionRate.toString()}%)`}
        />
      </>
    ),
    [],
  );

  // * 상품홍보 정보 렌더 함수
  const renderProductPromotionInfo = useCallback(
    (item: settlementItemType) => (
      <>
        <GridTableItem title="상품홍보 고유번호" value={item.productPromotion.id} />
        <GridTableItem
          title="정산액 및 수수료율"
          value={`${getLocaleNumber(
            item.amount,
          )}원 (${item.productPromotion.broadcasterCommissionRate.toString()}%)`}
        />
      </>
    ),
    [],
  );

  return (
    <Stack spacing={4} textAlign={{ base: 'center', sm: 'unset' }}>
      <Heading as="h6" fontSize="large">
        정산 정보
      </Heading>
      <Grid templateColumns="1fr 3fr">
        {infos.map((info) => (
          <GridTableItem key={info.title} title={info.title} value={info.value} />
        ))}
      </Grid>

      <Heading as="h6" fontSize="large">
        정산 상세 정보
      </Heading>

      {data.broadcasterSettlementItems.map((item) => (
        <Box key={item.id} borderWidth="thin" borderRadius="md" p={{ base: 1, sm: 2 }}>
          <Grid mt={1} templateColumns="1fr 2fr">
            <GridTableItem title="정산번호" value={item.id} />
            <GridTableItem title="정산물품 출고번호" value={item.exportCode} />
            <GridTableItem
              title="판매유형"
              value={<SellTypeBadge sellType={item.sellType} />}
            />
            {item.liveShopping && renderLiveShoppingInfo(item)}
            {item.productPromotion && renderProductPromotionInfo(item)}
          </Grid>
        </Box>
      ))}
    </Stack>
  );
}

interface SettlementHistoryDetailDialogProps {
  data: FindBcSettlementHistoriesRes[number];
  isOpen: boolean;
  onClose: () => void;
}
/** 방송인 수익 정산 상세 정보 다이얼로그 */
function SettlementHistoryDetailDialog({
  data,
  isOpen,
  onClose,
}: SettlementHistoryDetailDialogProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>정산대상 자세히보기</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SettlementHistoryDetail data={data} />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>닫기</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
