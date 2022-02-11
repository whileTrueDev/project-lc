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
import {
  useBcSettlementTargets,
  useBroadcasterSettlementTotalInfo,
  useCreateSettleBcManyMutation,
} from '@project-lc/hooks';
import {
  BroadcasterSettlementTarget,
  convertFmDeliveryCompanyToString,
  CreateBroadcasterSettlementHistoryItem,
} from '@project-lc/shared-types';
import { settlementHistoryStore } from '@project-lc/stores';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';

export function calcSettleAmount(
  price: number,
  commissionRate: Decimal | string | number,
): number {
  return Math.floor(Number(price) * (Number(commissionRate) / 100));
}

/** 총 주문금액 셀 */
function TotalAmountCell({ row }: GridCellParams): JSX.Element {
  const total = useBroadcasterSettlementTotalInfo(row as BroadcasterSettlementTarget);
  return <Text>{!total.price ? '-' : total.price.toLocaleString()}</Text>;
}

/** 방송인 수익 정산 대상 목록 */
export function BcSettlementTargetList(): JSX.Element {
  const targets = useBcSettlementTargets();

  // * 상세보기 관련
  const detailDialog = useDisclosure();
  const [detailSelected, setDetailSelected] =
    useState<BroadcasterSettlementTarget | null>(null);
  const onDetailOpen = useCallback(
    (data: BroadcasterSettlementTarget): void => {
      detailDialog.onOpen();
      setDetailSelected(data);
    },
    [detailDialog],
  );
  function onDetailClose(): void {
    detailDialog.onClose();
    setDetailSelected(null);
  }

  // * datagrid columns
  const columns = useMemo<GridColumns>(() => {
    return [
      { field: 'export_code', headerName: '출고코드', width: 150 },
      {
        field: 'confirm_date',
        headerName: '구매확정일',
        width: 150,
        valueFormatter: ({ row }) => dayjs(row.confirm_date).format('YYYY/MM/DD'),
      },
      {
        field: 'order_user_name',
        headerName: '주문자(수령자)',
        width: 130,
        sortable: false,
        valueFormatter: ({ row }) => `${row.order_user_name}(${row.recipient_user_name})`,
      },
      { field: 'buy_confirm', headerName: '구매확정타입', sortable: false, width: 120 },
      {
        field: 'delivery_company_code',
        headerName: '택배사',
        width: 100,
        valueFormatter: ({ row }) =>
          convertFmDeliveryCompanyToString(row.delivery_company_code),
      },
      { field: 'delivery_number', headerName: '운송장번호', width: 150 },
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
            onClick={() => onDetailOpen(row as BroadcasterSettlementTarget)}
          >
            자세히보기
          </Button>
        ),
      },
    ];
  }, [onDetailOpen]);

  // * datagrid rows
  const rows = useMemo(() => {
    if (!targets.data) return [];
    return targets.data.map((x) => ({ ...x, id: x.export_seq })) || [];
  }, [targets.data]);

  // * datagrid 선택된 행
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);
  const handleRowSelected = (selectionModel: GridSelectionModel): void => {
    setSelectedRows(selectionModel);
  };

  // * 일괄 정산 처리
  const confirmDialog = useDisclosure();
  const toast = useToast();
  const { mutateAsync } = useCreateSettleBcManyMutation();
  const onSuccess = (): void => {
    toast({ status: 'success', title: '정산처리 성공' });
  };
  const onFail = (): void => {
    toast({ status: 'error', title: '정산처리 실패' });
  };

  const roundStore = settlementHistoryStore();

  async function onExecuteSettleMany(): Promise<void> {
    const round = roundStore.selectedRound; // 'YYYY년MM월/1회차'
    if (!round) toast({ title: '회차를 설정해 주세요.' });
    else {
      const _exports = rows.filter((r) => selectedRows.includes(r.id));
      const dtoItems: Array<CreateBroadcasterSettlementHistoryItem> = [];
      _exports.forEach((exp) => {
        exp.items.forEach((i) => {
          if (!(i.liveShopping || i.productPromotion)) return;
          const commissionRate =
            i.liveShopping?.broadcasterCommissionRate ||
            i.productPromotion?.broadcasterCommissionRate ||
            '0';
          const amount = calcSettleAmount(Number(i.price), commissionRate);
          dtoItems.push({
            amount,
            exportCode: exp.export_code,
            liveShoppingId: i.liveShopping?.id,
            productPromotionId: i.productPromotion?.id,
            broadcasterId:
              i.liveShopping?.broadcaster.id ||
              i.productPromotion?.broadcasterPromotionPage.broadcaster.id,
            orderId: exp.order_seq.toString(),
            broadcasterCommissionRate: commissionRate,
          });
        });
      });

      await mutateAsync({ round, items: dtoItems }).then(onSuccess).catch(onFail);
    }
  }

  return (
    <Box minHeight={{ base: 300, md: 400 }} mt={3}>
      <ChakraDataGrid
        bg={useColorModeValue('inherit', 'gray.300')}
        autoHeight
        columns={columns}
        rows={rows}
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
  settlementTarget: BroadcasterSettlementTarget;
}
/** 방송인 수익 정산 상세 정보 */
function BcSettlementTargetDetail({
  settlementTarget,
}: BcSettlementTargetDetailProps): JSX.Element {
  const total = useBroadcasterSettlementTotalInfo(settlementTarget);
  const infos = useMemo(
    () => [
      { title: '출고코드', value: settlementTarget.export_code },
      {
        title: '주문자(수령자)',
        value: `${settlementTarget.order_user_name}(${settlementTarget.recipient_user_name})`,
      },
      {
        title: '택배사',
        value: convertFmDeliveryCompanyToString(settlementTarget.delivery_company_code),
      },
      { title: '운송장번호', value: settlementTarget.delivery_number },
      {
        title: '총 출고 가격',
        value: total.price ? `${total.price.toLocaleString()}원` : '-',
      },
      {
        title: '총 정산액',
        value: total.settleAmount ? `${total.settleAmount.toLocaleString()}원` : '-',
      },
    ],
    [
      settlementTarget.delivery_company_code,
      settlementTarget.delivery_number,
      settlementTarget.export_code,
      settlementTarget.order_user_name,
      settlementTarget.recipient_user_name,
      total.price,
      total.settleAmount,
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
        <Box
          key={item.item_option_seq}
          borderWidth="thin"
          borderRadius="md"
          p={{ base: 1, sm: 2 }}
        >
          <Grid templateColumns="repeat(4, 1fr)" gap={{ base: 1, sm: 2 }}>
            <GridItem colSpan={{ base: 4, sm: 1 }}>
              <ChakraNextImage
                src={`http://whiletrue.firstmall.kr${item.image}`}
                width={75}
                height={75}
              />
            </GridItem>
            <GridItem colSpan={{ base: 4, sm: 3 }}>
              <Text fontWeight="bold">{item.goods_name}</Text>
              {item.title1 && item.option1 && (
                <Text fontSize="sm">{`${item.title1}: ${item.option1}`}</Text>
              )}
              <Text fontSize="sm">{Number(item.price).toLocaleString()} 원</Text>
            </GridItem>
          </Grid>
          <Box mt={4}>
            <Text fontWeight="semibold">라이브쇼핑정보</Text>
            <Grid mt={1} templateColumns="1fr 2fr">
              <GridTableItem
                title="방송인 활동명"
                value={
                  item.liveShopping?.broadcaster.userNickname ||
                  item.productPromotion?.broadcasterPromotionPage.broadcaster
                    .userNickname ||
                  ''
                }
              />
              <GridTableItem
                title="퍼스트몰 상품번호"
                value={
                  item.liveShopping?.fmGoodsSeq ||
                  item.productPromotion?.fmGoodsSeq ||
                  '-'
                }
              />
              {item.liveShopping && (
                <GridTableItem
                  title="판매기간"
                  value={
                    <Box>
                      <Text>
                        {dayjs(item.liveShopping.sellStartDate).format(
                          'YYYY/MM/DD HH시 mm분',
                        )}{' '}
                        부터
                      </Text>

                      <Text>
                        {dayjs(item.liveShopping.sellEndDate).format(
                          'YYYY/MM/DD HH시 mm분',
                        )}{' '}
                        까지
                      </Text>
                    </Box>
                  }
                />
              )}
              {item.liveShopping && (
                <GridTableItem
                  title="정산액 및 수수료율"
                  value={`${calcSettleAmount(
                    Number(item.price),
                    item.liveShopping.broadcasterCommissionRate,
                  ).toLocaleString()}원 (${item.liveShopping.broadcasterCommissionRate.toString()}%)`}
                />
              )}
              {item.productPromotion && (
                <GridTableItem
                  title="정산액 및 수수료율"
                  value={`${calcSettleAmount(
                    Number(item.price),
                    item.productPromotion.broadcasterCommissionRate,
                  ).toLocaleString()}원 (${item.productPromotion.broadcasterCommissionRate.toString()}%)`}
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
  settlementTarget: BroadcasterSettlementTarget;
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
