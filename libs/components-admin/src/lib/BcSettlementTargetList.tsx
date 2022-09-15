/* eslint-disable no-nested-ternary */
import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { GridCellParams, GridColumns, GridSelectionModel } from '@material-ui/data-grid';
import { Decimal } from '@prisma/client/runtime';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { GridTableItem } from '@project-lc/components-layout/GridTableItem';
import SellTypeBadge from '@project-lc/components-shared/SellTypeBadge';
import {
  useBcSettlementTargets,
  useBroadcasterSettlementTotalInfo,
  useCreateSettleBcManyMutation,
} from '@project-lc/hooks';
import {
  BroadcasterSettlementTargetsItem,
  CreateBroadcasterSettlementHistoryItem,
} from '@project-lc/shared-types';
import { settlementHistoryStore } from '@project-lc/stores';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import AdminDatagridWrapper, {
  NOT_CHECKED_BY_ADMIN_CLASS_NAME,
  useLatestCheckedDataId,
} from './AdminDatagridWrapper';

export function calcSettleAmount(
  price: number,
  commissionRate: Decimal | string | number,
): number {
  return Math.floor(Number(price) * (Number(commissionRate) / 100));
}

/** 총 주문금액 셀 */
function TotalAmountCell({ row }: GridCellParams): JSX.Element {
  const total = useBroadcasterSettlementTotalInfo(
    row as BroadcasterSettlementTargetsItem,
  );
  return <Text>{!total ? '-' : getLocaleNumber(total.total)}</Text>;
}

/** 방송인 수익 정산 대상 목록 */
export function BcSettlementTargetList(): JSX.Element {
  const latestCheckedDataId = useLatestCheckedDataId();
  const targets = useBcSettlementTargets();

  // * 상세보기 관련
  const detailDialog = useDisclosure();
  const [detailSelected, setDetailSelected] =
    useState<BroadcasterSettlementTargetsItem | null>(null);
  const onDetailOpen = useCallback(
    (data: BroadcasterSettlementTargetsItem): void => {
      detailDialog.onOpen();
      setDetailSelected(data);
    },
    [detailDialog],
  );
  const onDetailClose = (): void => {
    detailDialog.onClose();
    setDetailSelected(null);
  };

  // * datagrid columns
  const columns = useMemo<GridColumns>(() => {
    return [
      { field: 'exportCode', headerName: '출고코드', width: 150 },
      {
        field: 'buyConfirmDate',
        headerName: '구매확정일',
        width: 150,
        valueFormatter: ({ row }) => dayjs(row.buyConfirmDate).format('YYYY/MM/DD'),
      },
      {
        field: 'order.userName',
        headerName: '주문자(수령자)',
        width: 130,
        sortable: false,
        valueFormatter: ({ row }) =>
          `${row.items[0].orderItem.order.ordererName}(${row.items[0].orderItem.order.recipientName})`,
      },
      {
        field: 'buyConfirmSubject',
        headerName: '구매확정타입',
        sortable: false,
        width: 120,
      },
      { field: 'deliveryCompany', headerName: '택배사', width: 100 },
      { field: 'deliveryNumber', headerName: '운송장번호', width: 150 },
      {
        field: 'totalAmount',
        headerName: '총 주문금액',
        width: 120,
        renderCell: TotalAmountCell,
        sortable: false,
      },
      {
        field: '상세보기',
        headerName: '자세히',
        renderCell: ({ row }) => (
          <Button
            size="xs"
            onClick={() => onDetailOpen(row as BroadcasterSettlementTargetsItem)}
          >
            자세히보기
          </Button>
        ),
      },
    ];
  }, [onDetailOpen]);

  // * datagrid 선택된 행
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);
  const handleRowSelected = (selectionModel: GridSelectionModel): void => {
    setSelectedRows(selectionModel);
  };

  // * 일괄 정산 처리
  const confirmDialog = useDisclosure();
  const toast = useToast();
  const roundStore = settlementHistoryStore();
  const { mutateAsync } = useCreateSettleBcManyMutation();
  const onSuccess = (): void => {
    toast({ status: 'success', title: '정산처리 성공' });
  };
  const onFail = (): void => {
    toast({ status: 'error', title: '정산처리 실패' });
  };
  const onExecuteSettleMany = async (): Promise<void> => {
    const round = roundStore.selectedRound; // 'YYYY년MM월/1회차'
    if (!round) {
      toast({ title: '회차를 설정해 주세요.' });
      return;
    }
    const _exports = targets.data?.filter((r) => selectedRows.includes(r.id));
    const dtoItems: Array<CreateBroadcasterSettlementHistoryItem> = [];
    if (!_exports) {
      toast({ description: '선택된 행이 없습니다. ' });
      return;
    }
    _exports.forEach((exp) => {
      exp.items.forEach((i) => {
        if (!(i.orderItem.support.liveShopping || i.orderItem.support.productPromotion))
          return;
        const commissionRate =
          i.orderItem.support.liveShopping?.broadcasterCommissionRate ||
          i.orderItem.support.productPromotion?.broadcasterCommissionRate ||
          '0';
        const optionPrice =
          i.orderItemOption.quantity * Number(i.orderItemOption.discountPrice);
        const amount = calcSettleAmount(optionPrice, commissionRate);
        dtoItems.push({
          amount,
          exportCode: exp.exportCode || `NON_EXPORT_CODE_${exp.id}`,
          liveShoppingId: i.orderItem.support.liveShopping?.id,
          productPromotionId: i.orderItem.support.productPromotion?.id,
          broadcasterId: i.orderItem.support.broadcaster.id,
          orderId: i.orderItem.order.id.toString(),
          broadcasterCommissionRate: commissionRate,
        });
      });
    });

    await mutateAsync({ round, items: dtoItems }).then(onSuccess).catch(onFail);
  };

  return (
    <Box minHeight={{ base: 300, md: 400 }} mt={3}>
      <AdminDatagridWrapper>
        <ChakraDataGrid
          bg={useColorModeValue('inherit', 'gray.300')}
          autoHeight
          columns={columns}
          rows={targets.data || []}
          getRowClassName={(params) => {
            if (params.row.id > latestCheckedDataId) {
              return NOT_CHECKED_BY_ADMIN_CLASS_NAME;
            }
            return '';
          }}
          rowsPerPageOptions={[10, 20, 50, 100]}
          disableSelectionOnClick
          disableColumnMenu
          checkboxSelection
          selectionModel={selectedRows}
          onSelectionModelChange={handleRowSelected}
          density="compact"
          components={{
            Toolbar: () => (
              <Box py={2}>
                <Button
                  size="sm"
                  isDisabled={selectedRows.length <= 0}
                  rightIcon={<ExternalLinkIcon />}
                  colorScheme="blue"
                  onClick={confirmDialog.onOpen}
                >
                  일괄정산처리
                </Button>
              </Box>
            ),
          }}
        />
      </AdminDatagridWrapper>

      {/* 일괄 정산 처리 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.onClose}
        title="일괄 정산처리 진행"
        onConfirm={onExecuteSettleMany}
        isDisabled={!roundStore.selectedRound}
      >
        선택된 대상에 대하여 일괄 정산 처리를 진행합니까?
        <Box>
          <RadioGroup
            value={roundStore.selectedRound}
            onChange={(newV) => {
              if (!newV) roundStore.resetRoundSelect();
              roundStore.handleRoundSelect(newV);
            }}
          >
            <Stack mt={4} direction="row" justifyContent="center">
              <Radio value="1">1회차</Radio>
              <Radio value="2">2회차</Radio>
            </Stack>
          </RadioGroup>
        </Box>
      </ConfirmDialog>

      {/* 상세보기 다이얼로그 */}
      {detailSelected && (
        <BcSettlementTargetDetailDialog
          settlementTarget={detailSelected}
          isOpen={detailDialog.isOpen}
          onClose={onDetailClose}
        />
      )}
    </Box>
  );
}

interface BcSettlementTargetDetailProps {
  settlementTarget: BroadcasterSettlementTargetsItem;
}
/** 방송인 수익 정산 상세 정보 */
function BcSettlementTargetDetail({
  settlementTarget,
}: BcSettlementTargetDetailProps): JSX.Element {
  const total = useBroadcasterSettlementTotalInfo(settlementTarget);
  const infos = useMemo(
    () => [
      { title: '출고코드', value: settlementTarget.exportCode },
      {
        title: '주문자(수령자)',
        value: `${settlementTarget.items[0].orderItem.order.ordererName}(${settlementTarget.items[0].orderItem.order.recipientName})`,
      },
      { title: '택배사', value: settlementTarget.deliveryCompany },
      { title: '운송장번호', value: settlementTarget.deliveryNumber },
      {
        title: '총 출고 가격',
        value: total ? `${getLocaleNumber(total.total)}원` : '-',
      },
      {
        title: '총 정산액',
        value: total.settleAmount ? `${getLocaleNumber(total.settleAmount)}원` : '-',
      },
    ],
    [
      settlementTarget.deliveryCompany,
      settlementTarget.deliveryNumber,
      settlementTarget.exportCode,
      settlementTarget.items,
      total,
    ],
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
        출고상품정보
      </Heading>
      {settlementTarget.items.map((item) => (
        <Box key={item.id} borderWidth="thin" borderRadius="md" p={{ base: 1, sm: 2 }}>
          <Grid templateColumns="repeat(4, 1fr)" gap={{ base: 1, sm: 2 }}>
            <GridItem colSpan={{ base: 4, sm: 1 }}>
              {item.orderItem.goods.image && (
                <ChakraNextImage
                  src={item.orderItem.goods.image[0].image}
                  width={75}
                  height={75}
                />
              )}
            </GridItem>
            <GridItem colSpan={{ base: 4, sm: 3 }}>
              <Text fontWeight="bold">{item.orderItem.goods.goods_name}</Text>
              {item.orderItemOption.name && item.orderItemOption.value && (
                <Text fontSize="sm">{`${item.orderItemOption.name}: ${item.orderItemOption.value} ${item.quantity}개`}</Text>
              )}
              <Text fontSize="sm">
                총{' '}
                {getLocaleNumber(
                  Number(item.orderItemOption.discountPrice) *
                    item.orderItemOption.quantity,
                )}{' '}
                원{' '}
                <Text fontSize="xs" as="span">
                  (개당 {getLocaleNumber(item.orderItemOption.discountPrice)} 원)
                </Text>
              </Text>
            </GridItem>
          </Grid>
          <Box mt={4}>
            <Grid mt={1} templateColumns="1fr 2fr">
              <GridTableItem
                title="판매유형"
                value={
                  <SellTypeBadge
                    sellType={
                      item.orderItem.support.liveShopping
                        ? 'liveShopping'
                        : item.orderItem.support.productPromotion
                        ? 'productPromotion'
                        : 'normal'
                    }
                  />
                }
              />
              <GridTableItem
                title="방송인 활동명"
                value={item.orderItem.support?.broadcaster.userNickname}
              />
              {item.orderItem.support.liveShopping && (
                <GridTableItem
                  title="판매기간"
                  value={
                    <Box>
                      <Text>
                        {dayjs(item.orderItem.support.liveShopping.sellStartDate).format(
                          'YYYY/MM/DD HH시 mm분',
                        )}{' '}
                        부터
                      </Text>

                      <Text>
                        {dayjs(item.orderItem.support.liveShopping.sellEndDate).format(
                          'YYYY/MM/DD HH시 mm분',
                        )}{' '}
                        까지
                      </Text>
                    </Box>
                  }
                />
              )}
              {item.orderItem.support.liveShopping && (
                <GridTableItem
                  title="정산액 및 수수료율"
                  value={`${calcSettleAmount(
                    Number(item.orderItemOption.discountPrice) *
                      item.orderItemOption.quantity,
                    item.orderItem.support.liveShopping.broadcasterCommissionRate,
                  ).toLocaleString()}원 (${item.orderItem.support.liveShopping.broadcasterCommissionRate.toString()}%)`}
                />
              )}
              {item.orderItem.support.productPromotion && (
                <GridTableItem
                  title="정산액 및 수수료율"
                  value={`${calcSettleAmount(
                    Number(item.orderItemOption.discountPrice) *
                      item.orderItemOption.quantity,
                    item.orderItem.support.productPromotion.broadcasterCommissionRate,
                  ).toLocaleString()}원 (${item.orderItem.support.productPromotion.broadcasterCommissionRate.toString()}%)`}
                />
              )}
            </Grid>
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

interface BcSettlementTargetDetailDialogProps {
  settlementTarget: BroadcasterSettlementTargetsItem;
  isOpen: boolean;
  onClose: () => void;
}
/** 방송인 수익 정산 상세 정보 다이얼로그 */
function BcSettlementTargetDetailDialog({
  settlementTarget,
  isOpen,
  onClose,
}: BcSettlementTargetDetailDialogProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>정산대상 자세히보기</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <BcSettlementTargetDetail settlementTarget={settlementTarget} />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>닫기</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
